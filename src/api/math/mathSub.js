import request from '@/utils/request'

// 查询主观题列表
export function listMathSub(query) {
  return request({
    url: '/math/mathSub/list',
    method: 'get',
    params: query
  })
}

// 查询主观题详细
export function getMathSub(questionId) {
  return request({
    url: '/math/mathSub/' + questionId,
    method: 'get'
  })
}

// 新增主观题
export function addMathSub(data) {
  return request({
    url: '/math/mathSub',
    method: 'post',
    data: data
  })
}

// 修改主观题
export function updateMathSub(data) {
  return request({
    url: '/math/mathSub',
    method: 'put',
    data: data
  })
}

// 删除主观题
export function delMathSub(questionId) {
  return request({
    url: '/math/mathSub/' + questionId,
    method: 'delete'
  })
}
