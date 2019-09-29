
const membersController = require('../controllers').members;
const eventsController = require('../controllers').events;
const attendeeController = require('../controllers').attendee;
const userController = require('../controllers').user;
const zstatisticsController = require('../controllers').zstatistics;
const scheduleController = require('../controllers').schedule;
const organizationController = require('../controllers').organization;

module.exports = (app) => {

  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome ... API for creation SCHEDULES!'
  }));

  app.post('/api/user/login', userController.userLogin);
  app.post('/api/user/check_create', userController.check_create);
  app.post('/api/user/', userController.create);

  app.post('/api/members/list', membersController.list);
  app.post('/api/members/names', membersController.names);
  // app.post('/api/members/belong', membersController.belonglist);
  app.post('/api/members/birthes', membersController.birthes);
  app.post('/api/members/newes', membersController.newes);
  app.delete('/api/members/:id', membersController.destroy);
  app.post('/api/members/photo', membersController.uploadPhoto);
  app.post('/api/members/check_create', membersController.check_create);
  app.post('/api/members/create', membersController.create);
  app.put('/api/members/:id', membersController.update);

  app.post('/api/events/list', eventsController.list);
  app.post('/api/events/forbelongs', eventsController.ev);
  app.post('/api/events/forgraph', eventsController.graph);
  app.delete('/api/events/:id', eventsController.destroy);
  app.post('/api/events/check_create', eventsController.check_create);
  app.post('/api/events/create', eventsController.create);
  app.put('/api/events/:id', eventsController.update);

  app.post('/api/attendee/list', attendeeController.list);
  app.post('/api/attendee/forevent', attendeeController.listForEvent);
  app.delete('/api/attendee/:id', attendeeController.destroy);
  app.post('/api/attendee/', attendeeController.create);
  app.post('/api/attendee/bulk', attendeeController.bulkCreate);
  app.put('/api/attendee/:id', attendeeController.update);
  app.put('/api/attendee/bulks', attendeeController.bulkUpdate);

  // statistics 
  app.post('/api/statistics/attendance', zstatisticsController.attendance);
  app.post('/api/statistics/paragraph', zstatisticsController.paragraph);
  app.post('/api/statistics/bible', zstatisticsController.bible);

  app.post('/api/schedule/list', scheduleController.list);
  app.post('/api/schedule/forevent', scheduleController.listForEvent);
  app.delete('/api/schedule/:id', scheduleController.destroy);
  app.post('/api/schedule/', scheduleController.create);
  app.put('/api/schedule', scheduleController.update);

  app.post('/api/schedule/upload', scheduleController.upload);
  app.post('/api/schedule/attachments', scheduleController.attachments);
  app.post('/api/schedule/attachments_delete', scheduleController.deleteAttachments);
  app.post('/api/schedule/attachments_delete_all', scheduleController.deleteAttachmentsAll);

  //organization
  app.post('/api/organization/list', organizationController.list);
  app.delete('/api/organization/:id', organizationController.destroy);
  app.post('/api/organization/create', organizationController.create);
  app.put('/api/organization', organizationController.update);
  app.post('/api/organization/photo', organizationController.uploadPhoto);

};