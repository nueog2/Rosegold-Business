const jwt = require('../modules/jwt');
const message = require("../../config/message")

async function checkUserToken(req, res, next){
    if(!req.headers.authorization) return res.status(message['400_BAD_REQUEST'].status).send(message.issueMessage(message['400_BAD_REQUEST'], "SEND_TOKEN"));
    var token = req.headers.authorization.split(" ")[1];

    if (!token) return res.status(message['400_BAD_REQUEST']).send(message.issueMessage(message['400_BAD_REQUEST'], "SEND_TOKEN"));

    jwt.verifyToken(token).then(response => {
        if(!response.payload.id || !response.payload.u_id || !response.payload.type){
            return res.status(message['498_INVALID_TOKEN'].status).send(message['498_INVALID_TOKEN'])
        }

        req.user = response.payload
        next()
    }).catch(error => {
        if(!error.status) return res.status(message["500_SERVER_INTERNAL_ERROR"].status).send(message.issueMessage(message["500_SERVER_INTERNAL_ERROR"], "UNDEFINED_ERROR"))
        else return res.status(error.status).send(error)
    })
}

module.exports = {
    checkUserToken
}