import request from '@/utils/request'

// 查询判断题列表
export function listMathTf(query) {
  return request({
    url: '/math/mathTf/list',
    method: 'get',
    params: query
  })
}

// 查询判断题详细
export function getMathTf(questionId) {
  return request({
    url: '/math/mathTf/' + questionId,
    method: 'get'
  })
}

// 新增判断题
export function addMathTf(data) {
  return request({
    url: '/math/mathTf',
    method: 'post',
    data: data
  })
}

// 修改判断题
export function updateMathTf(data) {
  return request({
    url: '/math/mathTf',
    method: 'put',
    data: data
  })
}

// 删除判断题
export function delMathTf(questionId) {
  return request({
    url: '/math/mathTf/' + questionId,
    method: 'delete'
  })
}
