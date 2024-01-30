import request from '@/utils/request'

//增加试题进入试卷
export function addChoiceFormPaper(data){
  return request({
    url: '/formPaper/formPaper/choice',
    method: 'post',
    data: data
  })
}

export function addTfFormPaper(data){
  return request({
    url: '/formPaper/formPaper/tf',
    method: 'post',
    data: data
  })
}

export function addSubFormPaper(data){
  return request({
    url: '/formPaper/formPaper/sub',
    method: 'post',
    data: data
  })
}

export function changePaperStatus(param){
  return request({
    url: '/formPaper/formPaper/changePaperStatus',
    method: 'post',
    data: { paperId: param }
  })
}

