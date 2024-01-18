import request from '@/utils/request'

// 查询选择题列表
export function listChoiceChoice(query) {
  return request({
    url: '/chinese/choiceChoice/list',
    method: 'get',
    params: query
  })
}

// 查询选择题详细
export function getChoiceChoice(questionId) {
  return request({
    url: '/chinese/choiceChoice/' + questionId,
    method: 'get'
  })
}

// 新增选择题
export function addChoiceChoice(data) {
  return request({
    url: '/chinese/choiceChoice',
    method: 'post',
    data: data
  })
}

// 修改选择题
export function updateChoiceChoice(data) {
  return request({
    url: '/chinese/choiceChoice',
    method: 'put',
    data: data
  })
}

// 删除选择题
export function delChoiceChoice(questionId) {
  return request({
    url: '/chinese/choiceChoice/' + questionId,
    method: 'delete'
  })
}
