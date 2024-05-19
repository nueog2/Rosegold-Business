const router = require("express").Router();
const managementController = require("../../../controllers/management");
const authUtil = require("../../../middlewares/auth_util");

router.post("/", managementController.createWorker);
router.get("/many", managementController.getWorkerMany);
router.get("/many/department", managementController.getWorkerManyByDepartment);
router.get("/department", managementController.getWorkerManyByDepartment2); // 호텔 부서별 직원 조회 router 추가
router.get("/one", managementController.getWorkerOne);
router.put("/", managementController.updateWorker);
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

module.exports = router;
