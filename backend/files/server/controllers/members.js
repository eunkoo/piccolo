const fs = require('fs');
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

function getPhotoUrl(req, _memberId, _photoName) {
  var hostname = ( req.headers.host.match(/:/g) ) ? req.headers.host.slice( 0, req.headers.host.indexOf(":") ) : req.headers.host
  const photo_url = `${req.protocol}://${hostname}:8001/uploads/${_photoName}`;
  return photo_url;
};

function getPhotoName(req, _memberId ) {
  const date = new Date();
  let photo_name = `${_memberId}_${date.getTime()}`;

  return photo_name.substring(0, 19);
}

module.exports = {
  
  list(req, res) {
    members.all()
      .then(members => {        
        var hostname = ( req.headers.host.match(/:/g) ) ? req.headers.host.slice( 0, req.headers.host.indexOf(":") ) : req.headers.host
        members.forEach(member => {
          member.photo = `${req.protocol}://${hostname}:8001/uploads/${member.photo}`;
        });
        return res.status(200).send(members);
      })
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
    console.log(`get names ${req.params.belong}`)
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
    console.log(`get birth ${req.params.month}`);
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
      console.log(`get newes ${req.params.belong}`)
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
     members
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
    console.log(`-------------- upload photo id:${req.params.id} ---------------`);
    if (req.files === undefined) return;
    var startup_image = req.files.file;
    var extention = startup_image.mimetype.split('/')[1];

    const photoName = getPhotoName(req, req.params.id);
    const photo_url = getPhotoUrl(req, req.params.id, photoName);

    var tmp_path = req.files.file.path;
    var target_path = `uploads/${photoName}`;

    console.log(` * tmp_path: ${tmp_path}`);
    console.log(` * target_path: ${target_path}`);
    fs.writeFile(target_path, req.files.file.data, function(err){
      if (err) {
        console.log(`an error occurred while rename uploaded image `, err);
      }

      // 접근 가능한 회원이미지 경로를 생성하고 저장한다.     
      console.log(` * 회원 이미지 저장됨. 이미지이름: ${photoName}`);
      members
        .findById(req.params.id)
        .then(members => {
          if (!members) {
            return res.status(404).send({
              message: 'members Not Found',
            });
          }
          members
            .update({ photo: photoName })
            .then(() => res.status(200).send({ 'photo_url': photo_url } ))
            .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
    });
  },
  check_create(req,res){
    return  members.findOne({
        where: {
          name: req.body.name,
          belong : req.body.belong, 
          id: {
            [Sequelize.Op.ne]: req.body.id
          }
        }
      })
    .then(members => res.status(201).send(members))
    .catch(error => res.status(400).send(error));
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