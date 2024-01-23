import request from '@/utils/request'

// 查询选择题列表
export function listMathChoice(query) {
  return request({
    url: '/math/mathChoice/list',
    method: 'get',
    params: query
  })
}

// 查询选择题详细
export function getMathChoice(questionId) {
  return request({
    url: '/math/mathChoice/' + questionId,
    method: 'get'
  })
}

// 新增选择题
export function addMathChoice(data) {
  return request({
    url: '/math/mathChoice',
    method: 'post',
    data: data
  })
}

// 修改选择题
export function updateMathChoice(data) {
  return request({
    url: '/math/mathChoice',
    method: 'put',
    data: data
  })
}

// 删除选择题
export function delMathChoice(questionId) {
  return request({
    url: '/math/mathChoice/' + questionId,
    method: 'delete'
  })
}
