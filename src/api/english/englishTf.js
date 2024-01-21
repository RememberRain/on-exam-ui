import request from '@/utils/request'

// 查询判断题列表
export function listEnglishTf(query) {
  return request({
    url: '/english/englishTf/list',
    method: 'get',
    params: query
  })
}

// 查询判断题详细
export function getEnglishTf(questionId) {
  return request({
    url: '/english/englishTf/' + questionId,
    method: 'get'
  })
}

// 新增判断题
export function addEnglishTf(data) {
  return request({
    url: '/english/englishTf',
    method: 'post',
    data: data
  })
}

// 修改判断题
export function updateEnglishTf(data) {
  return request({
    url: '/english/englishTf',
    method: 'put',
    data: data
  })
}

// 删除判断题
export function delEnglishTf(questionId) {
  return request({
    url: '/english/englishTf/' + questionId,
    method: 'delete'
  })
}
