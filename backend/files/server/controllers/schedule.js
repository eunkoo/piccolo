const fs = require('fs');

const schedule = require('../models').schedule;

function createDirectory(path) {
  try {
    if (fs.existsSync(path)) {
      console.log(`${path} directory is exist.`);
    } else {
      fs.mkdirSync(path);
      console.log(`${path} directory created successfully.`);
    }
  } catch (e) {
    console.log(`createDirectory exception. `, e);
  }
}


function getAttachmentsFileList(eid, id) {

  let base_path = `frontend/files/uploads/schedule`;
  let target_dir_path = `${base_path}/${eid}_${id}`;
  const data = [];
  const files = fs.readdirSync(target_dir_path);
  files.forEach(file => {
    console.log(` * filename : ${file}`);
    data.push(
      {
        name: file, 
        path: target_dir_path, 
        fullpath: `${target_dir_path}/${file}`,
        testpath: `/frontend/files/uploads/schedules/${eid}_${id}/${file}`,
      }
    );  
  });
  return data;
}


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
        where :{eid : req.body.eid },        
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
    console.log(req.body)
    return schedule
   .create({
     mid:req.body.mid,
     eid:req.body.eid,
     name: req.body.name,
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
            name: req.body.name,
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


  upload(req, res) {
    console.log(`___schdule upload file___`);
    console.log(req.files);
    console.log(req.body.eid);
    console.log(req.body.id);

    const eid = req.body.eid;
    const id = req.body.id;
    let data = [];

    if ( eid && id ) {
      let base_path = `frontend/files/uploads/schedule`;
      let target_dir_path = `${base_path}/${eid}_${id}`;
      let target_full_path = `${target_dir_path}/${req.files.test.name}`;
      console.log(`target path: ${target_full_path}`);
      createDirectory(base_path);
      createDirectory(target_dir_path);
      fs.writeFile(target_full_path, req.files.test.data, {encoding: 'base64'}, function(err){
        if (err) {
          console.log(`fail store uploaded file `);
          console.log(err);
        }
      });
      data = getAttachmentsFileList(eid, id);
    }
    return res.status(200).send({ 'attachments': data });
  }, 

  attachments(req, res) {
    console.log(`___ get attachments list ____`);
    console.log(`event: ${req.body.eid} schedule: ${req.body.id}`);
    const eid = req.body.eid;
    const id = req.body.id;
    let data = [];
    if ( eid && id ) {
      data = getAttachmentsFileList(eid, id);
    }
    return res.status(200).send({ 'attachments' : data });
  },

  deleteAttachments(req, res) {
    console.log(`___ delete attachments ___`);
    console.log(`event: ${req.body.eid} schedule: ${req.body.id} filename: ${req.body.test}`);
    const eid = req.body.eid;
    const id = req.body.id;
    let data = [];
    if (eid && id ) {
      let base_path = `frontend/files/uploads/schedule`;
      let target_dir_path = `${base_path}/${eid}_${id}`;
      let target_file = `${target_dir_path}/${req.body.test}`;

      // delete file 
      fs.unlinkSync(target_file);
      console.log(`deleted ${req.body.test} successfully`);
      data = getAttachmentsFileList(eid, id);
    }
    return res.status(200).send({ 'attachments': data });
  },

  deleteAttachmentsAll(req, res) {
    console.log(`___ delete attachments all ___`);
    console.log(`event: ${req.body.eid} schedule: ${req.body.id} `);
    const eid = req.body.eid;
    const id = req.body.id;
    if (eid && id ) {
      let base_path = `frontend/files/uploads/schedule`;
      let target_dir_path = `${base_path}/${eid}_${id}`;
      
      const files = fs.readdirSync(target_dir_path);
      for (let index = 0; index < files.length; index += 1) {
        // delete file 
        let target_file = `${target_dir_path}/${files[index]}`;
        fs.unlinkSync(target_file);
        console.log(` * deleted ${files[index]}`);
      }
      fs.rmdirSync(target_dir_path);

    }
    return res.status(200).send({ 'attachments': [] });
  }
};