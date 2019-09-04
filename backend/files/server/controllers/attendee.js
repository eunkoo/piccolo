const attendee = require('../models').attendee;

module.exports = {
  
  list(req, res) {
    return attendee
      .all()
      .then(attendee => res.status(200).send(attendee))
      .catch(error => res.status(400).send(error));
  },
  listForEvent(req, res){
    return attendee
    .all({
        where :{eid : req.body.id},
        order: ['connected']
    })
    .then(attendee => res.status(200).send(attendee))
    .catch(error => res.status(400).send(error));
  },
  destroy(req, res) {
    return attendee
      .findById(req.body.id)
      .then(attendee => {
        if (!attendee) {
          return res.status(400).send({
            message: 'attendee Not Found',
          });
        }
        return attendee
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  create(req, res) {
    console.log(req.body)
    return attendee
      .create({
        // id: req.body.id,
        name: req.body.name,
        mid:req.body.mid,
        eid:req.body.eid,
        grade:req.body.grade,
        attended:req.body.attended,
        paragraph:req.body.paragraph,
        bible:req.body.bible,
        comment:req.body.comment,
        connected:req.body.connected,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
      })
      .then(attendee => res.status(201).send(attendee))
      .catch(error => res.status(400).send(error));
  },
  bulkCreate(req, res) {
      console.log(req.body)
    return attendee
      .bulkCreate( req.body ,{updateOnDuplicate:['attended','comment','bible','paragraph']})
      .then(attendee => res.status(201).send(attendee))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return attendee
      .findById(req.params.id)
      .then(attendee => {
        if (!attendee) {
          return res.status(404).send({
            message: 'attendee Not Found',
          });
        }
        return attendee
          .update({
            name: req.body.name || attendee.name,
            grade:req.body.grade ,
            mid:req.body.mid || attendee.mid,
            eid:req.body.eid || attendee.eid,
            attended:req.body.attended ,
            connected:req.body.connected,
            paragraph:req.body.paragraph || attendee.paragraph,
            bible:req.body.bible ,
            comment:req.body.comment
          })
          .then(() => res.status(200).send(attendee))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  bulkUpdate(req, res){
    console.log(req.body)
    return attendee
      .bulkCreate( req.body )
      .then(attendee => res.status(201).send(attendee.all({
        order: ['connected']
        }) ))
      .catch(error => res.status(400).send(error));
  }
};