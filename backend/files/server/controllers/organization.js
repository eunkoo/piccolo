const organization = require('../models').organization;
const fs = require('fs');

function getPhotoUrl(req, _orgId, _orgName) {
    // var hostname = ( req.headers.host.match(/:/g) ) ? req.headers.host.slice( 0, req.headers.host.indexOf(":") ) : req.headers.host
    // const photo_url = '../../../uploads/'+_photoName;
    // return photo_url;
    return _orgName
  };
  
  function getPhotoName(req, _orgId ) {
    const date = new Date();
    let photo_name = `${_orgId}_${date.getTime()}`;
  
    return `${photo_name.substring(0, 19)}.png`;
  }

module.exports = {

    list(req, res) {
        return organization
            .all({
                where: { year: req.body.year },
                order: ['belongs']
            })
            .then(organization => res.status(200).send(organization))
            .catch(error => res.status(400).send(error));
    },
    destroy(req, res) {
        organization
            .findById(req.params.id)
            .then(organization => {
                if (!organization) {
                    return res.status(400).send({
                        message: '등록된 조직이 없습니다',
                    });
                }
                return organization
                    .destroy()
                    .then(organization => res.status(200).send(organization))
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
    
    uploadPhoto(req, res){
        console.log(`-------------- upload photo id:${req.body.id} ---------------`);
        // console.log(req)
        if (req.files === null ) return res.status(204).send({message:'photo is not exist'});
        if( req.body.id === undefined) return res.status(404).send({message:'id is not exist'});
        var startup_image = req.files.file;
        var extention = startup_image.mimetype.split('/')[1];
    
        const photoName = getPhotoName(req, req.body.id);
        const photo_url = getPhotoUrl(req, req.body.id, photoName);
    
        // var tmp_path = req.files.file.path;
        var target_path = `frontend/files/uploads/org/${photoName}`;
    
        // console.log(` * tmp_path: ${tmp_path}`);
        console.log(` * target_path: ${target_path}`);
        fs.writeFile(target_path, req.files.file.data,{encoding: 'base64'}, function(err){
          if (err) {
            console.log(`an error occurred while rename uploaded image `, err);
          }
    
          // 접근 가능한 회원이미지 경로를 생성하고 저장한다.     
          console.log(` * 회원 이미지 저장됨. 이미지이름: ${photoName}`);
          organization
            .findById(req.body.id)
            .then(organization => {
              if (!organization) {
                return res.status(404).send({
                  message: 'org Not Found',
                });
              }
              return organization
                .update({ photo: photoName })
                .then(() => res.status(200).send({ 'photo_url': photo_url } ))
                .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
        });
      },

    create(req, res) {
        console.log(req.body)
        return organization
            .create({
                belongs: req.body.belongs,
                name: req.body.name,
                year: req.body.year,
                role: req.body.role,
                createdAt: req.body.createdAt,
                updatedAt: req.body.updatedAt,
            })
            .then(organization => res.status(201).send(organization))
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        organization
            .findById(req.body.id)
            .then(organization => {
                if (!organization) {
                    return res.status(404).send({
                        message: '등록된 조직이 없습니다',
                    });
                }
                return organization
                    .update({
                        belongs: req.body.belongs,
                        name: req.body.name,
                        year: req.body.year,
                        role: req.body.role
                    })
                    .then(() => res.status(200).send(organization))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
};