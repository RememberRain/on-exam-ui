import request from '@/utils/request'

// 查询教师管理列表
export function listTeacher(query) {
  return request({
    url: '/teacher/teacher/list',
    method: 'get',
    params: query
  })
}

// 查询教师管理详细
export function getTeacher(teacherId) {
  return request({
    url: '/teacher/teacher/' + teacherId,
    method: 'get'
  })
}

// 新增教师管理
export function addTeacher(data) {
  return request({
    url: '/teacher/teacher',
    method: 'post',
    data: data
  })
}

// 修改教师管理
export function updateTeacher(data) {
  return request({
    url: '/teacher/teacher',
    method: 'put',
    data: data
  })
}

// 删除教师管理
export function delTeacher(teacherId) {
  return request({
    url: '/teacher/teacher/' + teacherId,
    method: 'delete'
  })
}
