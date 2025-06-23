import request from "@/utils/request";

// 查询供应商列表
export function listSupplier(query) {
  return request({
    url: "/business/supplier/page",
    method: "get",
    params: query,
  });
}

// 查询供应商详细
export function getSupplier(supplierId) {
  return request({
    url: "/business/supplier/detail/" + supplierId,
    method: "get",
  });
}

// 新增供应商
export function addSupplier(data) {
  return request({
    url: "/business/supplier",
    method: "post",
    data: data,
  });
}

// 修改供应商
export function editSupplier(data) {
  return request({
    url: "/business/supplier",
    method: "put",
    data: data,
  });
}

// 删除供应商
export function delSupplier(supplierId) {
  return request({
    url: "/business/supplier/" + supplierId,
    method: "delete",
  });
}

// 提交要审核的供应商
export function remarkSupplier(supplierId) {
  return request({
    url: "/business/supplier/submit/" + supplierId,
    method: "post",
    data: { id: supplierId },
  });
}

// 审核人员审核供应商
export function remarkSupplier2(data) {
  return request({
    url: "/business/supplier/check",
    method: "post",
    data: data,
  });
}