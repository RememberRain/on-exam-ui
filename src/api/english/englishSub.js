import request from '@/utils/request'

// 查询主观题列表
export function listEnglishSub(query) {
  return request({
    url: '/english/englishSub/list',
    method: 'get',
    params: query
  })
}

// 查询主观题详细
export function getEnglishSub(questionId) {
  return request({
    url: '/english/englishSub/' + questionId,
    method: 'get'
  })
}

// 新增主观题
export function addEnglishSub(data) {
  return request({
    url: '/english/englishSub',
    method: 'post',
    data: data
  })
}

// 修改主观题
export function updateEnglishSub(data) {
  return request({
    url: '/english/englishSub',
    method: 'put',
    data: data
  })
}

// 删除主观题
export function delEnglishSub(questionId) {
  return request({
    url: '/english/englishSub/' + questionId,
    method: 'delete'
  })
}
