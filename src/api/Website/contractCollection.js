// 引入请求库（HTTP请求库）
import request from "@/utils/request";

/**
 * 获取合同收款审核分页列表
 * @function listContractCollection
 * @param {Object} query - 查询参数对象
 * @param {string} [query.contractId] - 合同号（可选）
 * @param {number} [query.savingType] - 存储方式(0-草稿,1-正式，可选)
 * @returns {Promise<Object>} 分页数据对象 { total, rows, code, msg }
 */
export function listContractCollection(query) {
    return request({
        url: "/business/contractFinance/collection/list",
        method: "get",
        params: query,
    });
}

/**
 * 获取合同收款审核详情
 * @function getContractCollectionDetail
 * @param {string|number} id - 合同收款审核ID
 * @returns {Promise<Object>} 详情数据对象 { code, data, ... }
 */
export function getContractCollectionDetail(id) {
    return request({
        url: `/business/contractCollection/detail/${id}`,
        method: "get",
    });
}

// 保存合同收款审核模板
export function saveContractCollection(data) {
    return request({
        url: "/business/contractCollection",
        method: "post",
        data,
    });
}

// 确认收款
export function contractCollectionDetail(data) {
    return request({
        url: `/business/contractFinance/collection/confirm`,
        method: "put",
        data,
    });
}

// 拒绝收款
export function rejectContractCollection(data) {
    return request({
        url: `/business/contractCollection/refuse`,
        method: "post",
        data,
    });
}

// 收款详情列表
export function getContractCollectionDetailList(id) {
    return request({
        url: `/business/contractCollection/getDetails`,
        method: "get",
        params: {
            contractId: id
        }
    });
}


// 获取合同详情
export function getContractDetail(id) {
    return request({
        url: `/business/contractFinance/contract/getDetail`,
        method: "get",
        params: {
            contractId: id
        }        
    });
}