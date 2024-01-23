import request from '@/utils/request'

// 查询判断题列表
export function listChineseTf(query) {
  return request({
    url: '/chinese/chineseTf/list',
    method: 'get',
    params: query
  })
}

// 查询判断题详细
export function getChineseTf(questionId) {
  return request({
    url: '/chinese/chineseTf/' + questionId,
    method: 'get'
  })
}

// 新增判断题
export function addChineseTf(data) {
  return request({
    url: '/chinese/chineseTf',
    method: 'post',
    data: data
  })
}

// 修改判断题
export function updateChineseTf(data) {
  return request({
    url: '/chinese/chineseTf',
    method: 'put',
    data: data
  })
}

// 删除判断题
export function delChineseTf(questionId) {
  return request({
    url: '/chinese/chineseTf/' + questionId,
    method: 'delete'
  })
}
