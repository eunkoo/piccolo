
const schedule = require('../models').schedule;
module.exports = {
  
  list(req, res) {
    return schedule
      .all()
      .then(schedule => res.status(200).send(schedule))
      .catch(error => res.status(400).send(error));
  },
  listForEvent(req, res){
    return schedule
    .all({
        where :{eid : req.body.eid}
    })
    .then(schedule => res.status(200).send(schedule))
    .catch(error => res.status(400).send(error));
  },

  destroy(req, res) {
    schedule
      .findById(req.params.id)
      .then(schedule => {
        if (!schedule) {
          return res.status(400).send({
            message: '등록된 이벤트가 없습니다',
          });
        }
        return schedule
          .destroy()
          .then(schedule => res.status(200).send(schedule))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
//   check_create(req,res){
//     return  events.findOne({
//       where: {
//         day: req.body.day,
//         title:req.body.title,
//         belongs : req.body.belongs
//       }
//     }).then(events => res.status(201).send(events))
//     .catch((error) => res.status(400).send(error));

//   },
  create(req, res) {
    return schedule
   .create({
     mid:req.body.mid,
     eid:req.body.eid,
     title: req.body.title,
     time:req.body.time,
     start:req.body.start,
     end:req.body.end,
     belongs:req.body.belongs,
     duration:req.body.duration,
     link:req.body.link,
     color:req.body.color,
     createdAt: req.body.createdAt,
     updatedAt: req.body.updatedAt,
   })
   .then(schedule => res.status(201).send(schedule))
   .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    schedule
      .findById(req.body.id)
      .then(schedule => {
        if (!schedule) {
          return res.status(404).send({
            message: '등록된 이벤트가 없습니다',
          });
        }
        return schedule
          .update({
            mid:req.body.mid,
            eid:req.body.eid,
            title: req.body.title,
            time:req.body.time,
            start:req.body.start,
            end:req.body.end,
            belongs:req.body.belongs,
            duration:req.body.duration,
            link:req.body.link,
            color:req.body.color,
          })
          .then(() => res.status(200).send(schedule))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};