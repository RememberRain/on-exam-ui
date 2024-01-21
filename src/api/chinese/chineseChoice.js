import request from '@/utils/request'

// 查询选择题列表
export function listChineseChoice(query) {
  return request({
    url: '/chinese/chineseChoice/list',
    method: 'get',
    params: query
  })
}

// 查询选择题详细
export function getChineseChoice(questionId) {
  return request({
    url: '/chinese/chineseChoice/' + questionId,
    method: 'get'
  })
}

// 新增选择题
export function addChineseChoice(data) {
  return request({
    url: '/chinese/chineseChoice',
    method: 'post',
    data: data
  })
}

// 修改选择题
export function updateChineseChoice(data) {
  return request({
    url: '/chinese/chineseChoice',
    method: 'put',
    data: data
  })
}

// 删除选择题
export function delChineseChoice(questionId) {
  return request({
    url: '/chinese/chineseChoice/' + questionId,
    method: 'delete'
  })
}
