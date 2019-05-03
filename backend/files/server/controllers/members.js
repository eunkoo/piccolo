const members = require('../models').members;
const formidable = require('formidable');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
sequelize = new Sequelize(config.database, config.username,config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });
  sequelize.members = sequelize.import('../models/members');
const moment = require('moment')
module.exports = {
  
  list(req, res) {
    return members
      .all()
      .then(members => res.status(200).send(members))
      .catch(error => res.status(400).send(error));
  },
  belonglist(req,res){
    return members
    .all({
      where: { belong:req.params.belong} ,
      order: ['connected']
      })
    .then(members => res.status(200).send(members))
    .catch(error => res.status(400).send(error));
  },
  names(req, res) {
      console.log('get names '+ req.params.belong)
    return members
      .all({
        where: { belong:req.params.belong,
            $and: [{grade: {$lt: 3}}]
        },
        attributes: ['id', 'name','grade','connected'],
        order: ['connected']
        })
      .then(members => res.status(200).send(members))
      .catch(error => res.status(400).send(error));
  },
  birthes(req, res) {
    console.log("get birth")
    console.log(req.params.month)
    return members
        .all({
        where: { belong:req.params.belong, 
            [Sequelize.Op.and]: [
                sequelize.where(members.sequelize.fn('MONTH',  members.sequelize.col('birth')), req.params.month)
              ]
        } ,
        attributes: ['id', 'name']
        })
        .then(members => res.status(200).send(members))
        .catch(error => res.status(400).send(error));
},
    newes(req, res) {
    console.log('get newes '+ req.params.belong)
    return members
        .all({
            where: { belong:req.params.belong, 
                     grade : 1
            } ,
            attributes: ['id', 'name']
        })
        .then(members => res.status(200).send(members))
        .catch(error => res.status(400).send(error));
},

  destroy(req, res) {
    return members
      .findById(req.params.id)
      .then(members => {
        if (!members) {
          return res.status(400).send({
            message: 'members Not Found',
          });
        }
        return members
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  uploadPhoto(req, res){
    if(req.files === undefined) return;
    var startup_image = req.files.file;
    // const path = require('path');
    // path.dirname('/home/edo/piccolo/res/img/')
    console.log(req.params.id)
    console.log(startup_image)
    
    var extention = startup_image.mimetype.split('/')[1];

    startup_image.mv('/home/edo/piccolo/frontend/src/assets/img/'+req.params.id+'.'+extention, function(err) {
      if(err){
        console.log(err);
      }else{
        console.log("uploaded");
      }
    });
   
      members
      .findById(req.params.id)
      .then(members => {
        if (!members) {
          return res.status(404).send({
            message: 'members Not Found',
          });
        }
         members
        .update({
          photo: req.params.id+'.'+extention
        })
          .then(() => res.status(200).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
    
  },

  create(req, res) {
    return members
      .create({
        // id: req.body.id,
        name: req.body.name,
        address: req.body.address,
        phone : req.body.phone,
        gender: req.body.gender,
        birth: req.body.birth,
        connected: req.body.connected,
        belong: req.body.belong,
        grade: req.body.grade,
        tag : req.body.tag,
        baptism : req.body.baptism,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
      })
      .then(members => res.status(201).send(members))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return members
      .findById(req.params.id)
      .then(members => {
        if (!members) {
          return res.status(404).send({
            message: 'members Not Found',
          });
        }
        console.log(req.body)
        return members
          .update({
            name: req.body.name || members.name,
            address: req.body.address || members.address,
            phone : req.body.phone || members.phone,
            gender: req.body.gender ,
            birth: req.body.birth || members.birth,
            connected: req.body.connected ||members.connected,
            grade: req.body.grade,
            baptism : req.body.baptism,
            // photo: req.body.photo || members.photo,
            belong: req.body.belong ,
            tag : req.body.tag || members.tag
          })
          .then(() => res.status(200).send(members))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};