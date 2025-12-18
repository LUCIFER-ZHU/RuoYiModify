/**
 * WebSocket 全局状态管理模块
 * @description 管理 STOMP over SockJS 的全局连接，支持多页面订阅不同主题
 * @author ERP System
 */

import { defineStore } from "pinia";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";

/**
 * WebSocket 连接状态枚举
 */
export const SocketStatus = {
    DISCONNECTED: "disconnected", // 未连接
    CONNECTING: "connecting", // 连接中
    CONNECTED: "connected", // 已连接
    RECONNECTING: "reconnecting", // 重连中
};

/**
 * WebSocket Store
 * @description 全局 WebSocket 状态管理，实现单例连接模式
 */
const useSocketStore = defineStore("socket", {
    state: () => ({
        /** @type {Client|null} STOMP 客户端实例 */
        client: null,

        /** @type {string} 连接状态 */
        status: SocketStatus.DISCONNECTED,

        /** @type {Map<string, Object>} 订阅主题映射表，key: topic, value: {subscription, callbacks} */
        subscriptions: new Map(),

        /** @type {number} 重连次数 */
        reconnectCount: 0,

        /** @type {number} 最大重连次数 */
        maxReconnectAttempts: 5,

        /** @type {boolean} 是否手动断开连接 */
        manualDisconnect: false,

        /** @type {string|null} WebSocket 服务器 URL */
        wsUrl: null,

        /** @type {string|null} 当前用户 ID */
        userId: null,

        /** @type {Array<Function>} 连接成功回调队列 */
        connectCallbacks: [],

        /** @type {Array<Function>} 连接断开回调队列 */
        disconnectCallbacks: [],
    }),

    getters: {
        /**
         * 是否已连接
         * @returns {boolean}
         */
        isConnected: (state) => state.status === SocketStatus.CONNECTED,

        /**
         * 是否正在连接
         * @returns {boolean}
         */
        isConnecting: (state) =>
            state.status === SocketStatus.CONNECTING ||
            state.status === SocketStatus.RECONNECTING,

        /**
         * 获取所有订阅的主题列表
         * @returns {Array<string>}
         */
        subscribedTopics: (state) => Array.from(state.subscriptions.keys()),
    },

    actions: {
        /**
         * 初始化并连接 WebSocket
         * @param {Object} config - 连接配置
         * @param {string} config.wsUrl - WebSocket 服务器地址
         * @param {string} config.userId - 用户ID
         * @param {string} [config.token] - 认证令牌
         */
        async connect({ wsUrl, userId, token }) {
            try {
                // 如果已经连接，直接返回
                if (this.isConnected) {
                    console.log("✅ WebSocket 已连接，无需重复连接");
                    return;
                }

                // 如果正在连接，等待连接完成
                if (this.isConnecting) {
                    console.log("⏳ WebSocket 正在连接中...");
                    return;
                }

                this.status = SocketStatus.CONNECTING;
                this.wsUrl = wsUrl;
                this.userId = userId;
                this.manualDisconnect = false;

                console.log("🔌 开始建立 WebSocket 连接...", { wsUrl, userId });

                // 创建 STOMP 客户端
                const client = new Client({
                    // WebSocket 工厂函数 - 每次重连都创建新的 SockJS 实例
                    // 注意：不能在外部创建 socket 实例再返回，否则重连时会复用已关闭的连接
                    webSocketFactory: () => new SockJS(wsUrl, null, {
                        withCredentials: true, // 携带 Cookie
                    }),

                    // 连接头信息（携带 token）
                    connectHeaders: {
                        Authorization: `Bearer ${token || getToken()}`,
                    },

                    // 心跳配置（incoming: 接收, outgoing: 发送）单位：毫秒
                    heartbeatIncoming: 10000,
                    heartbeatOutgoing: 10000,

                    // 重连延迟（毫秒）
                    reconnectDelay: 5000,

                    // 调试模式（生产环境建议关闭）
                    debug: (msg) => {
                            console.log("🔍 STOMP Debug:", msg);
                    },

                    // 连接成功回调
                    onConnect: () => {
                        this.status = SocketStatus.CONNECTED;
                        this.reconnectCount = 0;
                        console.log("✅ WebSocket 连接成功");
                        // ElMessage.success("实时通信已连接");

                        // 重新订阅之前的主题（重连场景）
                        this._resubscribeAll();

                        // 执行连接成功回调
                        this._executeConnectCallbacks();
                    },

                    // 连接失败回调
                    onStompError: (frame) => {
                        console.error("❌ STOMP 协议错误:", frame);
                        this.status = SocketStatus.DISCONNECTED;
                        ElMessage.error(
                            `WebSocket 连接错误: ${
                                frame.headers?.message || "未知错误"
                            }`
                        );
                    },

                    // 断开连接回调
                    onDisconnect: () => {
                        console.log("🔌 WebSocket 已断开");

                        // 如果不是手动断开，尝试重连
                        if (
                            !this.manualDisconnect &&
                            this.reconnectCount < this.maxReconnectAttempts
                        ) {
                            this.status = SocketStatus.RECONNECTING;
                            this.reconnectCount++;
                            console.log(
                                `🔄 尝试重连... (${this.reconnectCount}/${this.maxReconnectAttempts})`
                            );
                        } else {
                            this.status = SocketStatus.DISCONNECTED;
                            this._executeDisconnectCallbacks();
                        }
                    },

                    // WebSocket 错误回调
                    onWebSocketError: (event) => {
                        console.error("❌ WebSocket 错误:", event);
                        ElMessage.error("网络连接异常，请检查网络状态");
                    },
                });

                // 激活客户端（开始连接）
                client.activate();

                this.client = client;
            } catch (error) {
                console.error("❌ WebSocket 连接失败:", error);
                this.status = SocketStatus.DISCONNECTED;
                ElMessage.error(`WebSocket 连接失败: ${error.message}`);
                throw error;
            }
        },

        /**
         * 订阅主题
         * @param {string} topic - 主题地址（例如：/topic/system, /user/queue/notifications）
         * @param {Function} callback - 消息回调函数
         * @param {Object} [headers={}] - 订阅头信息
         * @returns {Function|null} 取消订阅函数
         */
        subscribe(topic, callback, headers = {}) {
            try {
                // 检查是否已连接
                if (!this.client || !this.isConnected) {
                    console.warn("⚠️ WebSocket 未连接，订阅将在连接后自动执行");

                    // 将订阅任务加入待处理队列
                    this._addPendingSubscription(topic, callback, headers);
                    return null;
                }

                // 检查是否已订阅该主题
                if (this.subscriptions.has(topic)) {
                    const sub = this.subscriptions.get(topic);
                    // 添加新的回调函数到现有订阅
                    sub.callbacks.push(callback);
                    console.log(`📢 已添加回调到现有订阅: ${topic}`);

                    // 返回取消订阅函数
                    return () => this._removeCallback(topic, callback);
                }

                console.log(`📢 订阅主题: ${topic}`);

                // 执行订阅
                const subscription = this.client.subscribe(
                    topic,
                    (message) => {
                        try {
                            // 解析消息体
                            const data = JSON.parse(message.body);
                            console.log(`📨 收到消息 [${topic}]:`, data);

                            // 执行所有回调函数
                            const sub = this.subscriptions.get(topic);
                            if (sub) {
                                sub.callbacks.forEach((cb) => {
                                    try {
                                        cb(data, message);
                                    } catch (error) {
                                        console.error(
                                            `回调执行错误 [${topic}]:`,
                                            error
                                        );
                                    }
                                });
                            }
                        } catch (error) {
                            console.error(`消息解析错误 [${topic}]:`, error);
                        }
                    },
                    headers
                );

                // 保存订阅信息
                this.subscriptions.set(topic, {
                    subscription,
                    callbacks: [callback],
                    headers,
                });

                // 返回取消订阅函数
                return () => this.unsubscribe(topic);
            } catch (error) {
                console.error(`订阅失败 [${topic}]:`, error);
                throw error;
            }
        },

        /**
         * 取消订阅主题
         * @param {string} topic - 主题地址
         */
        unsubscribe(topic) {
            try {
                if (this.subscriptions.has(topic)) {
                    const sub = this.subscriptions.get(topic);

                    // 取消 STOMP 订阅
                    if (sub.subscription) {
                        sub.subscription.unsubscribe();
                    }

                    // 从映射表中删除
                    this.subscriptions.delete(topic);

                    console.log(`🔕 已取消订阅: ${topic}`);
                }
            } catch (error) {
                console.error(`取消订阅失败 [${topic}]:`, error);
            }
        },

        /**
         * 发送消息到服务器
         * @param {string} destination - 目标地址
         * @param {Object} body - 消息体
         * @param {Object} [headers={}] - 消息头
         */
        send(destination, body, headers = {}) {
            try {
                if (!this.client || !this.isConnected) {
                    throw new Error("WebSocket 未连接");
                }

                this.client.publish({
                    destination,
                    body: JSON.stringify(body),
                    headers: {
                        "content-type": "application/json",
                        ...headers,
                    },
                });

                console.log(`📤 发送消息到 ${destination}:`, body);
            } catch (error) {
                console.error(`发送消息失败 [${destination}]:`, error);
                throw error;
            }
        },

        /**
         * 断开 WebSocket 连接
         */
        async disconnect() {
            try {
                this.manualDisconnect = true;

                // 取消所有订阅
                this.subscriptions.forEach((_, topic) => {
                    this.unsubscribe(topic);
                });

                // 断开客户端连接
                if (this.client) {
                    await this.client.deactivate();
                    this.client = null;
                }

                this.status = SocketStatus.DISCONNECTED;
                this.reconnectCount = 0;

                console.log("👋 WebSocket 已断开连接");
            } catch (error) {
                console.error("❌ 断开连接失败:", error);
                throw error;
            }
        },

        /**
         * 订阅用户个人频道
         * @param {Function} callback - 消息回调函数
         * @returns {Function|null} 取消订阅函数
         */
        subscribeUserChannel(callback) {
            if (!this.userId) {
                console.error("❌ 用户 ID 未设置，无法订阅个人频道");
                return null;
            }

            const topic = `/user/${this.userId}/queue/notifications`;
            return this.subscribe(topic, callback);
        },

        /**
         * 订阅系统广播频道
         * @param {Function} callback - 消息回调函数
         * @returns {Function|null} 取消订阅函数
         */
        subscribeSystemChannel(callback) {
            const topic = "/topic/system";
            return this.subscribe(topic, callback);
        },

        /**
         * 添加连接成功回调
         * @param {Function} callback - 回调函数
         */
        onConnect(callback) {
            if (this.isConnected) {
                callback();
            } else {
                this.connectCallbacks.push(callback);
            }
        },

        /**
         * 添加连接断开回调
         * @param {Function} callback - 回调函数
         */
        onDisconnect(callback) {
            this.disconnectCallbacks.push(callback);
        },

        /**
         * 重新订阅所有主题（内部方法）
         * @private
         */
        _resubscribeAll() {
            console.log("🔄 重新订阅所有主题...");

            const topics = Array.from(this.subscriptions.entries());
            this.subscriptions.clear();

            topics.forEach(([topic, sub]) => {
                sub.callbacks.forEach((callback) => {
                    this.subscribe(topic, callback, sub.headers);
                });
            });
        },

        /**
         * 添加待处理的订阅（内部方法）
         * @private
         */
        _addPendingSubscription(topic, callback, headers) {
            // 当连接成功后自动订阅
            this.onConnect(() => {
                this.subscribe(topic, callback, headers);
            });
        },

        /**
         * 从订阅中移除特定回调（内部方法）
         * @private
         */
        _removeCallback(topic, callback) {
            if (this.subscriptions.has(topic)) {
                const sub = this.subscriptions.get(topic);
                const index = sub.callbacks.indexOf(callback);

                if (index > -1) {
                    sub.callbacks.splice(index, 1);
                }

                // 如果没有回调了，完全取消订阅
                if (sub.callbacks.length === 0) {
                    this.unsubscribe(topic);
                }
            }
        },

        /**
         * 执行连接成功回调（内部方法）
         * @private
         */
        _executeConnectCallbacks() {
            while (this.connectCallbacks.length > 0) {
                const callback = this.connectCallbacks.shift();
                try {
                    callback();
                } catch (error) {
                    console.error("连接回调执行错误:", error);
                }
            }
        },

        /**
         * 执行连接断开回调（内部方法）
         * @private
         */
        _executeDisconnectCallbacks() {
            this.disconnectCallbacks.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    console.error("断开回调执行错误:", error);
                }
            });
            this.disconnectCallbacks = [];
        },
    },
});

export default useSocketStore;
