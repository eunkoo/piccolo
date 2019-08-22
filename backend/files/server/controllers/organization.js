const organization = require('../models').organization;

module.exports = {

    list(req, res) {
        return organization
            .all({
                where: { year: req.params.year },
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
    create(req, res) {
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
            .findById(req.params.id)
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
                        role: req.body.role,
                    })
                    .then(() => res.status(200).send(organization))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
};