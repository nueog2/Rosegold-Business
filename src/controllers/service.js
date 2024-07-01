// 배열로 받아와서 sevice_category_id, service_id 이렇게 받아서 수정하게끔
// api 작성

const message = require("../../config/message");
const service = require("../../models/schema/service");
const ServiceAssignLog =
  require("../models/service_assign_log").ServiceAssignLog;
const Hotel = require("../models/hotel").Hotel;
const Service = require("../models/service").Service;

function createService(req, res) {
  if (
    req.body.name == null ||
    req.body.eng_name == null ||
    req.body.content == null ||
    req.body.purpose == null ||
    req.body.description == null ||
    req.body.service_category_id == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const service = new Service();

  service
    .create(
      req.body.name,
      req.body.eng_name,
      req.body.content,
      req.body.purpose,
      req.body.description,
      req.body.service_category_id
    )
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function getServiceMany(req, res) {
  const service = new Service();
  service
    .readMany({ service_category_id: req.query.service_category_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function getServiceOne(req, res) {
  if (req.query.service_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const service = new Service();
  service
    .readOne({ id: req.query.service_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function updateService(req, res) {
  const { update } = req.body;

  if (!Array.isArray(update)) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const promises = update.map((services) => {
    const { service_id, content, purpose, description, service_category_id } =
      services;

    if (!service_id || !service_category_id) {
      return new Promise.reject({
        status: message["400_BAD_REQUEST"].status,
        message: message.issueMessage(
          message["400_BAD_REQUEST"],
          "SEND_ALL_PARAMETERS"
        ),
      });
    }

    const service = new Service();
    return service.update(
      service_id,
      content,
      purpose,
      description,
      service_category_id
    );
  });

  // 모든 Promise가 처리된 후 응답
  Promise.all(promises)
    .then((responses) => {
      // 모든 응답이 성공적인지 확인
      if (responses.every((response) => response.status === 200)) {
        return res.status(message["200_SUCCESS"].status).send(responses);
      } else {
        // 응답 중 하나라도 실패한 경우 첫 번째 실패 응답을 반환
        const errorResponse = responses.find(
          (response) => response.status !== 200
        );
        return res.status(errorResponse.status).send(errorResponse);
      }
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function deleteService(req, res) {
  if (req.body.service_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const service = new Service();
  service
    .delete(req.body.service_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function createServiceAssignLog(req, res) {
  if (req.body.service_ids == null || req.body.department_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message["400_BAD_REQUEST"]);
  }

  const serviceAssignLog = new ServiceAssignLog();
  serviceAssignLog
    .create(req.body.service_ids, req.body.department_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

function getServiceAssignLogByDepartmentID(req, res) {
  if (req.query.department_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message["400_BAD_REQUEST"]);
  }

  const serviceAssignLog = new ServiceAssignLog();
  serviceAssignLog
    .readMany({ department_id: req.query.department_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

function deleteServiceAssignLog(req, res) {
  if (req.body.service_assign_log_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message["400_BAD_REQUEST"]);
  }

  const serviceAssignLog = new ServiceAssignLog();
  serviceAssignLog
    .delete(req.body.service_assign_log_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

module.exports = {
  createService,
  getServiceMany,
  getServiceOne,
  updateService,
  deleteService,
  createServiceAssignLog,
  getServiceAssignLogByDepartmentID,
  deleteServiceAssignLog,
};
