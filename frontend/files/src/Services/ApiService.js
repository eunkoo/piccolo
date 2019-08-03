import Api from '@/Services/Api'

export default {
  userLogin (params) {
    return Api().post('/user/login', params)
  },
  addUser (params) {
    return Api().post('/user', params)
  },
  checkUser (params) {
    return Api().post('/user/check_create', params)
  },

  fetchMembers() {
    return Api().get('/members')
  },
  fetchMember(belong) {
    return Api().get('/members/'+belong)
  },
  fetchNames(belong) {
    return Api().get('/members/name/'+belong)
  },
  fetchBirthes(belong,month) {
    return Api().get('/members/birthes/'+belong+'/'+month)
  },
  fetchNewes(belong,month) {
    return Api().get('/members/newes/'+belong+'/'+month)
  },
  deleteMembers(id) {
    return Api().delete('/members/' + id)
  },
  checkMembers(params) {
    return Api().post('/members/check_create', params)
  },
  addMembers(params) {
    return Api().post('/members', params)
  },
  uploadPhoto(params,id){
    return Api().post('/members/photo/'+id, params)
  },
  updateMembers(params) {
    return Api().put('/members/' + params.id, params)
  },

  fetchEvents () {
    return Api().get('/events')
  },
  fetchEvent (belongs) {
    return Api().get('/events/'+belongs)
  },
  fetchGraph(belongs,start,end) {
    return Api().get('/events/'+belongs+"/"+start+"/"+end)
  },
  deleteEvents(id) {
    return Api().delete('/events/' + id)
  },
  checkEvents(params) {
    return Api().post('/events/check_create', params)
  },
  addEvents(params) {
    return Api().post('/events', params)
  },
  updateEvents (params) {
    return Api().put('/events/' + params.id, params)
  },

  fetchAttendee (id) {
    return Api().get('/attendee/'+id)
  },
  deleteAttendee(id) {
    return Api().delete('/attendee/' + id)
  },
  addAttendee(params) {
    return Api().post('/attendee', params)
  },
  addAttendees(params) {
    return Api().post('/attendee/bulk', params)
  },
  updateAttendee(params) {
    return Api().put('/attendee/' + params.id, params)
  },
  updateAttendees(params) {
    return Api().put('/attendee/bulks', params)
  },

  // statistics 
  // 출석 통계 
  reqStatisticsAttendance(params) {
    return Api().post('/statistics/attendance', params);
  },
  // 암송 통계
  reqStatisticsParagraph(params) {
    return Api().post('/statistics/paragraph', params);
  },
  // 성경 통계
  reqStatisticsBible(params) {
    return Api().post('/statistics/bible', params);
  },
  
  fetchSchedule(eid) {
    return Api().get('/schedule/'+eid)
  },
  deleteSchedule(id) {
    return Api().delete('/schedule/' + id)
  },
  addSchedule(params) {
    return Api().post('/schedule', params)
  },
  updateSchedule(params) {
    return Api().put('/schedule/' + params.id,params)
  },
 


}
