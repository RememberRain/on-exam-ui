import request from '@/utils/request'

// 查询选择题列表
export function listEnglishChoice(query) {
  return request({
    url: '/english/englishChoice/list',
    method: 'get',
    params: query
  })
}

// 查询选择题详细
export function getEnglishChoice(questionId) {
  return request({
    url: '/english/englishChoice/' + questionId,
    method: 'get'
  })
}

// 新增选择题
export function addEnglishChoice(data) {
  return request({
    url: '/english/englishChoice',
    method: 'post',
    data: data
  })
}

// 修改选择题
export function updateEnglishChoice(data) {
  return request({
    url: '/english/englishChoice',
    method: 'put',
    data: data
  })
}

// 删除选择题
export function delEnglishChoice(questionId) {
  return request({
    url: '/english/englishChoice/' + questionId,
    method: 'delete'
  })
}
