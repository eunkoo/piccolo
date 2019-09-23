const events = require('../models').events;
const attendee = require('../models').attendee;
const schedule = require('../models').schedule;
const sch_color= ["#3F51B5", "#4CAF50", "#2196F3", "#1976d2", "#4CAF50"]
// const env = process.env.NODE_ENV || 'development';
// const config = require(`${__dirname}/../config/config.json`)[env];
// sequelize = new Sequelize(config.database, config.username,config.password, {
//     host: 'localhost',
//     dialect: 'mysql',
//     pool: {
//       max: 5,
//       min: 0,
//       idle: 10000,
//     },
//   });
//   sequelize.events = sequelize.import('../models/events');
module.exports = {
  
  list(req, res) {
    return events
      .all()
      .then(events => res.status(200).send(events))
      .catch(error => res.status(400).send(error));
  },

  ev(req, res) {
    console.log(req.body)
    return events
      .all({ where: { belongs:req.body.belongs}})
      .then(events => res.status(200).send(events))
      .catch(error => res.status(400).send(error));
  },
  graph(req, res) {
    return events
      .all(
            { 
                where: { belongs:req.body.belongs,
                    $and: [{start: {$gte: req.body.start}}, {start: {$lte:req.body.end}}]
                },
                order: ['start']
            }
        )
      .then(events => res.status(200).send(events))
      .catch(error => res.status(400).send(error));
  },

  destroy(req, res) {
     events
      .findById(req.params.id)
      .then(events => {
        if (!events) {
          return res.status(400).send({
            message: '등록된 이벤트가 없습니다',
          });
        }
        return events
          .destroy()
          .then(() => {
            attendee.destroy({where: {
                eid: req.params.id
             }})
            .then(events => res.status(201).send(events))
            .catch(error => res.status(401).send(error));
              res.status(204).send()
            })
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  check_create(req,res){
    return  events.findOne({
      where: {
        start: req.body.start,
        name:req.body.name,
        belongs : req.body.belongs
      }
    }).then(events => res.status(201).send(events))
    .catch((error) => res.status(400).send(error));

  },
  create(req, res) {
     events
   .create({
     name: req.body.name,
     start:req.body.start,
     end:req.body.end,
     place:req.body.place,
     director:req.body.director,
     belongs:req.body.belongs,
     notice:req.body.notice,
     birthes:req.body.birthes,
     newes:req.body.newes,
     offering:req.body.offering,
     totalmember:req.body.totalmember ,
     totalmorning:req.body.totalmorning ,
     totalnoon:req.body.totalnoon ,
     calendar:req.body.calendar ,
     createdAt: req.body.createdAt,
     updatedAt: req.body.updatedAt,
   })
   .then(events =>{
        res.status(200).send(events)
   } )
   .catch(error => res.status(400).send(error));
  },

  update(req, res) {
     events
      .findById(req.params.id)
      .then(events => {
        if (!events) {
          return res.status(404).send({
            message: '등록된 이벤트가 없습니다',
          });
        }
        console.log(req.body)
        return events
          .update({
            name: req.body.name || events.name,
            start:req.body.start || events.start,
            end:req.body.end || events.end,
            place:req.body.place || events.place,
            director:req.body.director || events.director,
            belongs:req.body.belongs || events.belongs,
            offering:req.body.offering ,
            totalmember:req.body.totalmember ,
            totalmorning:req.body.totalmorning ,
            totalnoon:req.body.totalnoon ,
            notice:req.body.notice ,
            birthes:req.body.birthes || events.birthes,
            newes:req.body.newes || events.newes,
            calendar:req.body.calendar ,
          })
          .then(() => res.status(200).send(events))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};