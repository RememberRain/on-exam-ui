import request from '@/utils/request'

// 查询考试结果列表
export function listResult(query) {
  return request({
    url: '/result/result/list',
    method: 'get',
    params: query
  })
}

// 查询考试结果详细
export function getResult(paperId) {
  return request({
    url: '/result/result/' + paperId,
    method: 'get'
  })
}

// 新增考试结果
export function addResult(data) {
  return request({
    url: '/result/result',
    method: 'post',
    data: data
  })
}

// 修改考试结果
export function updateResult(data) {
  return request({
    url: '/result/result',
    method: 'put',
    data: data
  })
}

// 删除考试结果
export function delResult(paperId) {
  return request({
    url: '/result/result/' + paperId,
    method: 'delete'
  })
}
