
const membersController = require('../controllers').members;
const eventsController = require('../controllers').events;
const attendeeController = require('../controllers').attendee;
const userController = require('../controllers').user;


module.exports = (app) => {

  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome ... API for creation SCHEDULES!'
  }));

 

  app.post('/api/user/login', userController.userLogin);
  app.post('/api/user/check_create', userController.check_create);
  app.post('/api/user/', userController.create);

  app.get('/api/members', membersController.list);
  app.get('/api/members/name/:belong', membersController.names);
  app.get('/api/members/:belong', membersController.belonglist);
  app.get('/api/members/birthes/:belong/:month', membersController.birthes);
  app.get('/api/members/newes/:belong/:month', membersController.newes);
  app.delete('/api/members/:id', membersController.destroy);
  app.post('/api/members/photo/:id', membersController.uploadPhoto);
  app.post('/api/members/check_create', membersController.check_create);
  app.post('/api/members/', membersController.create);
  app.put('/api/members/:id', membersController.update);

  app.get('/api/events', eventsController.list);
  app.get('/api/events/:belongs', eventsController.ev);
  app.get('/api/events/:belongs/:start/:end', eventsController.graph);
  app.delete('/api/events/:id', eventsController.destroy);
  app.post('/api/events/check_create', eventsController.check_create);
  app.post('/api/events/', eventsController.create);
  app.put('/api/events/:id', eventsController.update);

  app.get('/api/attendee', attendeeController.list);
  app.get('/api/attendee/:id', attendeeController.listForEvent);
  app.delete('/api/attendee/:id', attendeeController.destroy);
  app.post('/api/attendee/', attendeeController.create);
  app.post('/api/attendee/bulk', attendeeController.bulkCreate);
  app.put('/api/attendee/:id', attendeeController.update);
  app.put('/api/attendee/bulks', attendeeController.bulkUpdate);

};