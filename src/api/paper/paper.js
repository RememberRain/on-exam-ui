import request from '@/utils/request'

// 查询试卷管理列表
export function listPaper(query) {
  return request({
    url: '/paper/paper/list',
    method: 'get',
    params: query
  })
}

// 查询试卷管理详细
export function getPaper(paperId) {
  return request({
    url: '/paper/paper/' + paperId,
    method: 'get'
  })
}

// 新增试卷管理
export function addPaper(data) {
  return request({
    url: '/paper/paper',
    method: 'post',
    data: data
  })
}

// 修改试卷管理
export function updatePaper(data) {
  return request({
    url: '/paper/paper',
    method: 'put',
    data: data
  })
}

// 删除试卷管理
export function delPaper(paperId) {
  return request({
    url: '/paper/paper/' + paperId,
    method: 'delete'
  })
}
