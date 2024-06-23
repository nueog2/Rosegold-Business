const message = require("../../config/message");
// const { Hotel } = require("./hotel");
const models = require("../../models");


class ServiceAssignLog{
    create(service_id, department_id){
        return new Promise((resolve, reject) => {
            models.service_assign_log.create({
                department_id : department_id,
                service_id : service_id
            }).then(response => {
                return resolve(message["200_SUCCESS"])
            }).catch(error => {
                return reject(message["500_SERVER_INTERNAL_ERROR"])
            })
        })
    }

    readOne(condition){
        return new Promise((resolve, reject) => {
            models.service_assign_log.findOne({
                include : [{model : models.service, attributes : ["id", "name", "service_category_id"]}],
                where : condition
            }).then(response => {
                if(response){
                    var obj = Object.assign({}, message["200_SUCCESS"])
                    obj.service_assign_log = response.dataValues
                    return resolve(obj)
                }else{
                    return reject(message.issueMessage(message["404_NOT_FOUND"], "SERVICE_ASSIGN_LOG_NOT_FOUND"))
                }
            }).catch(error => {
                return reject(message["500_SERVER_INTERNAL_ERROR"])
            })
        })
    }

    readMany(condition){
        return new Promise((resolve, reject) => {
            models.service_assign_log.findAll({
                include : [{model : models.service, attributes : ["id", "name", "service_category_id"]}],
                where : condition
            }).then(response => {
                if(response.length > 0){
                    var obj = Object.assign({}, message["200_SUCCESS"])
                    obj.service_assign_logs = response
                    return resolve(obj)
                }else{
                    return reject(message.issueMessage(message["404_NOT_FOUND"], "SERVICE_ASSIGN_LOG_NOT_FOUND"))
                }
            }).catch(error => {
                return reject(message["500_SERVER_INTERNAL_ERROR"])
            })
        })
    }

    delete(service_assign_log_id){
        return new Promise((resolve, reject) => {
            this.readOne({ id : service_assign_log_id}).then(response => {
                models.service_assign_log.destroy({
                    where : {
                        id : service_assign_log_id
                    }
                }).then(response => {
                    return resolve(message["200_SUCCESS"])
                }).catch(error => {
                    return reject(message["500_SERVER_INTERNAL_ERROR"])
                })
            }).catch(error => {
                return reject(error)
            })
            
        })
    }
}

module.exports = {ServiceAssignLog}