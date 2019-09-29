const Api = require( '@/Services/Api')

// export default
module.exports=  {
  userLogin (params) {
    return Api.base().post('/user/login', params)
  },
  addUser (params) {
    return Api.base().post('/user', params)
  },
  checkUser (params) {
    return Api.base().post('/user/check_create', params)
  },

  fetchMembers() {
    return Api.base().post('/members/list')
  },
  // fetchBelongMembers(belong) {
  //   return Api().post('/members/belong',belong)
  // },
  fetchNames(belong) {
    return Api.base().post('/members/names',belong)
  },
  fetchBirthes(params) {
    return Api.base().post('/members/birthes',params)
  },
  fetchNewes(params) {
    return Api.base().post('/members/newes',params)
  },
  deleteMembers(id) {
    return Api.base().delete('/members/' + id)
  },
  checkMembers(params) {
    return Api.base().post('/members/check_create', params)
  },
  addMembers(params) {
    return Api.base().post('/members/create', params)
  },
  uploadMemPhoto(params){
    return Api.base().post('/members/photo', params)
  },
  updateMembers(params) {
    return Api.base().put('/members/' + params.id, params)
  },

  fetchEvents () {
    return Api.base().post('/events/list')
  },
  fetchEventForBelong (belongs) {
    return Api.base().post('/events/forbelongs',belongs)
  },
  fetchGraph(params) {
    return Api.base().post('/events/forgraph', params)
  },
  deleteEvents(id) {
    return Api.base().delete('/events/' + id)
  },
  checkEvents(params) {
    return Api.base().post('/events/check_create', params)
  },
  addEvents(params) {
    return Api.base().post('/events/create', params)
  },
  updateEvents (params) {
    return Api.base().put('/events/' + params.id, params)
  },

  fetchAttendee (params) {
    return Api.base().post('/attendee/forevent', params)
  },
  deleteAttendee(id) {
    return Api.base().delete('/attendee/' + id)
  },
  addAttendee(params) {
    return Api.base().post('/attendee', params)
  },
  addAttendees(params) {
    return Api.base().post('/attendee/bulk', params)
  },
  updateAttendee(params) {
    return Api.base().put('/attendee/' + params.id, params)
  },
  updateAttendees(params) {
    return Api.base().put('/attendee/bulks', params)
  },

  // statistics 
  // 출석 통계 
  reqStatisticsAttendance(params) {
    return Api.base().post('/statistics/attendance', params);
  },
  // 암송 통계
  reqStatisticsParagraph(params) {
    return Api.base().post('/statistics/paragraph', params);
  },
  // 성경 통계
  reqStatisticsBible(params) {
    return Api.base().post('/statistics/bible', params);
  },

  // schedule
  fetchScheduleForEvent(eid) {
    return Api.base().post('/schedule/forevent',eid)
  },
  deleteSchedule(id) {
    return Api.base().delete('/schedule/' + id)
  },
  addSchedule(params) {
    return Api.base().post('/schedule', params)
  },
  updateSchedule(params) {
    return Api.base().put('/schedule',params)
  },
 
// organization
  fetchOrganization(year) {
    return Api.base().post('/organization/list',year)
  },
  deleteOrganization(id) {
    return Api.base().delete('/organization/' + id)
  },
  addOrganization(params) {
    return Api.base().post('/organization/create', params)
  },
  updateOrganization(params) {
    return Api.base().put('/organization' ,params)
  },
  uploadOrgPhoto(params){
    return Api.base().post('/organization/photo', params)
  },

}
