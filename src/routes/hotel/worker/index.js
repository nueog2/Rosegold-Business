const router = require("express").Router();
const managementController = require("../../../controllers/management");
const authUtil = require("../../../middlewares/auth_util");

router.post("/", managementController.createWorker);
router.post("/fcmtoken", managementController.updateFCMTokenforWebByAccount); // 웹용 FCM Token 업데이트 router 추가
router.get("/many", managementController.getWorkerMany);
router.get("/many/department", managementController.getWorkerManyByDepartment);
router.get("/department", managementController.getWorkerManyByDepartment2); // 호텔 부서별 직원 조회 router 추가
router.get(
  "/departmenthotel",
  managementController.getWorkerManyByHotelAndDepartment
); // 호텔 부서별 직원 조회 router 추가
router.get("/one", managementController.getWorkerOne);
router.put("/", managementController.updateWorker);
router.put("/profile", managementController.updateWorkerProfile);
// 호텔 최고 관리자 여부 선택 router 추가
router.put("/admin", managementController.updateWorkerAdmin);
router.delete("/", managementController.deleteWorker);

router.put("/role", managementController.updateAssignLog);

router.get("/mobile/sign-in", managementController.getAccessTokenByAccount);
router.post(
  "/mobile/work/status",
  authUtil.verifyToken,
  managementController.updateWorkStatus
);
router.get(
  "/mobile/profile",
  authUtil.verifyToken,
  managementController.readProfileInfo
);

router.get(
  "/mobile/work/me/ing",
  authUtil.verifyToken,
  managementController.readWorkerProcessingReqLog
);

router.get(
  "/mobile/work/not-assign",
  authUtil.verifyToken,
  managementController.readWorkerNotAssignReqLog
);

router.post(
  "/mobile/work/cancel",
  authUtil.verifyToken,
  managementController.setReqLogNotAssign
);

router.get(
  "/mobile/work/me/finished",
  authUtil.verifyToken,
  managementController.readWorkerProcessedReqLog
);

router.post(
  "/mobile/work/assign",
  authUtil.verifyToken,
  managementController.setAssignWorker
);

router.post(
  "/mobile/work/finish",
  authUtil.verifyToken,
  managementController.setWorkFinish
);

module.exports = router;
