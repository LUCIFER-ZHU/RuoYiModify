// 通用PDF预览方法
// requestConfig: axios请求配置对象
// fallbackFileName: 可选的文件名，用于窗口标题和下载
import { ElMessage } from "element-plus";
import axios from "axios";
import { getToken } from "@/utils/auth";
import { tansParams } from "@/utils/ruoyi";

// 创建axios实例，避免每次调用都重新创建
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    headers: {
        "Content-Type": "application/json;charset=utf-8",
    },
});

// 添加请求拦截器，处理token和参数
axiosInstance.interceptors.request.use((config) => {
    // 添加token
    if (getToken()) {
        config.headers["Authorization"] = "Bearer " + getToken();
    }

    // get请求映射params参数
    if (config.method === "get" && config.params) {
        let url = config.url + "?" + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }

    return config;
});

/**
 * 从响应头中解析文件名
 * @param {Object} response - 响应对象
 * @returns {string} 解析出的文件名
 */
function getFileNameFromResponse(response) {
    try {
        // 尝试多种方式获取 Content-Disposition
        let contentDisposition = null;

        // 方式1：直接访问
        if (response.headers) {
            contentDisposition =
                response.headers["content-disposition"] ||
                response.headers["Content-Disposition"] ||
                response.headers["Content-disposition"];
        }

        // 方式2：遍历所有键查找
        if (!contentDisposition && response.headers) {
            for (const key in response.headers) {
                if (key.toLowerCase() === "content-disposition") {
                    contentDisposition = response.headers[key];
                    break;
                }
            }
        }

        // 方式3：使用 get() 方法（如果存在）
        if (
            !contentDisposition &&
            response.headers &&
            typeof response.headers.get === "function"
        ) {
            contentDisposition = response.headers.get("content-disposition");
        }

        if (contentDisposition) {
            // 解析 filename="xxx.pdf" 或 filename*=UTF-8''xxx.pdf
            const filenameMatch = contentDisposition.match(
                /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            );

            if (filenameMatch && filenameMatch[1]) {
                let filename = filenameMatch[1];
                // 移除引号
                if (filename.startsWith('"') && filename.endsWith('"')) {
                    filename = filename.slice(1, -1);
                }
                // 处理 URL 编码
                try {
                    filename = decodeURIComponent(filename);
                } catch {
                    // 如果解码失败，使用原始文件名
                }
                return filename;
            }
        }
    } catch (error) {
        console.warn("解析文件名失败:", error);
    }
    return null;
}

/**
 * 处理PDF预览
 * @param {Object} requestConfig - axios请求配置对象
 * @param {string} fallbackFileName - 备用文件名，当无法从响应头获取时使用
 */
export async function handlePreviewPdf(requestConfig, fallbackFileName) {
    try {
        // 直接使用预创建的axios实例发送请求，获取完整响应对象
        const response = await axiosInstance(requestConfig);

        // 从响应头中获取真实文件名
        const defaultFileName = `${new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/[-:T]/g, "")}.pdf`;
        const fileName =
            getFileNameFromResponse(response) ||
            fallbackFileName ||
            defaultFileName;

        // 检查返回的数据类型
        let blob;
        const data = response.data;
        if (data instanceof ArrayBuffer) {
            blob = new Blob([data], { type: "application/pdf" });
        } else if (typeof data === "string") {
            const uint8 = new TextEncoder().encode(data);
            blob = new Blob([uint8], { type: "application/pdf" });
        } else {
            blob = new Blob([data], { type: "application/pdf" });
        }

        const url = window.URL.createObjectURL(blob);

        // 创建预览窗口，使用iframe方式预览
        const previewWindow = window.open("", "_blank");

        if (!previewWindow) {
            ElMessage.warning("浏览器阻止了弹出窗口，请允许弹出窗口后重试");
            return;
        }

        // 设置窗口标题
        const title = fileName || "PDF预览";
        previewWindow.document.title = title;

        // 创建HTML内容
        const htmlContent = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
          }
          .header {
            background: #fff;
            padding: 12px 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .title {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            margin: 0;
          }
          .actions {
            display: flex;
            gap: 8px;
          }
          .btn {
            padding: 6px 12px;
            border: 1px solid #d0d0d0;
            background: #fff;
            color: #333;
            text-decoration: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn:hover {
            background: #f0f0f0;
            border-color: #409eff;
          }
          .btn-primary {
            background: #409eff;
            color: #fff;
            border-color: #409eff;
          }
          .btn-primary:hover {
            background: #66b1ff;
          }
          .pdf-container {
            height: calc(100vh - 60px);
            background: #fff;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${title}</h1>
          <div class="actions">
            <a href="${url}" class="btn" download="${
            fileName || "document.pdf"
        }">下载</a>
            <button class="btn btn-primary" onclick="printPdf()">打印</button>
            <button class="btn" onclick="window.close()">关闭</button>
          </div>
        </div>
        <div class="pdf-container">
          <iframe src="${url + "#toolbar=0"}" type="application/pdf"></iframe>
        </div>
      </body>
      </html>
    `;

        // 写入HTML内容 - 使用document.write确保script标签被执行
        previewWindow.document.open();
        previewWindow.document.write(htmlContent);
        previewWindow.document.close();

         // 确保printPdf函数在全局作用域中可用
         previewWindow.printPdf = function () {
             // 直接使用页面中已存在的iframe进行打印
             const existingIframe = previewWindow.document.querySelector('iframe');
             
             if (existingIframe) {
                 try {
                     // 尝试直接打印现有的iframe内容
                     existingIframe.contentWindow.print();
                 } catch {
                     // 如果直接打印失败，使用备用方案
                     window.open(`${url}`, "_blank");
                 }
             } else {
                 // 如果没有找到iframe，使用备用方案
                 window.open(`${url}`, "_blank");
             }
         };

        // 添加释放逻辑
        previewWindow.onbeforeunload = () => {
            window.URL.revokeObjectURL(url);
        };
    } catch (error) {
        console.error("PDF预览错误:", error);
        ElMessage.error(
            error?.response?.message || error?.message || "合同预览失败"
        );
    }
}
