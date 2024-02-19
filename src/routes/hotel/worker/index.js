const router = require("express").Router();
const managementController = require("../../../controllers/management");

router.post("/", managementController.createWorker);
router.get("/many", managementController.getWorkerMany);
router.get("/many/department", managementController.getWorkerManyByDepartment);
router.get("/one", managementController.getWorkerOne);
router.put("/", managementController.updateWorker);
router.delete("/", managementController.deleteWorker);
//ID/PW 사용자 인증 기반 JWT 발급 router 추가
router.post("/token", managementController.getTokensByWorkerAccountInfo);
router.post("/token/refresh", managementController.refreshToken);
router.put("/role", managementController.updateAssignLog);

module.exports = router;
