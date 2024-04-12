const router = require("express").Router();
const managementController = require("../../controllers/management");

router.post("/token", managementController.getTokensByWorkerAccountInfo);
router.post("/token/refresh", managementController.refreshToken);
router.get("/login", managementController.getProfileByToken);
router.post("/logout", managementController.logoutWorker);

module.exports = router;
