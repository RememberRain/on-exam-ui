import request from '@/utils/request'

// 查询主观题列表
export function listChineseSub(query) {
  return request({
    url: '/chinese/chineseSub/list',
    method: 'get',
    params: query
  })
}

// 查询主观题详细
export function getChineseSub(questionId) {
  return request({
    url: '/chinese/chineseSub/' + questionId,
    method: 'get'
  })
}

// 新增主观题
export function addChineseSub(data) {
  return request({
    url: '/chinese/chineseSub',
    method: 'post',
    data: data
  })
}

// 修改主观题
export function updateChineseSub(data) {
  return request({
    url: '/chinese/chineseSub',
    method: 'put',
    data: data
  })
}

// 删除主观题
export function delChineseSub(questionId) {
  return request({
    url: '/chinese/chineseSub/' + questionId,
    method: 'delete'
  })
}
