import request from '@/utils/request'

// 查询生成表数据
export function ArticleList(query) {
  return request({
    url: '/business/article/list',
    method: 'get',
    params: query
  })
}

//更新状态
export function updateStatus(id) {
  return request({
    url: '/business/article/updateStatus/'+ id,
    method: 'put'
  })
}

//删除
export function delCarousel(id) {
  return request({
    url: 'business/article/' + id,
    method: 'delete'
  })
}

// 获取分类字典树
export function getDictTree() {
  return request({
    url: '/business/articleType/dictTree',
    method: 'get'
  })
}

//修改文章
export function updateArticleContent(data) {
  return request({
    url: "/business/article",
    method: "put",
    data,
  });
}


// 新增文章
export function addArticle(data) {
  return request({
    url: "/business/article",
    method: "post",
    data,
  });
}

// 编辑文章
export function editArticle(data) {
  return request({
    url: "/business/article",
    method: "put",
    data,
  });
}