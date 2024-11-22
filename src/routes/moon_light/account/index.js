const router = require("express").Router();
const moon_accountController = require("../../../controllers/moonlight_account");

router.post("/", moon_accountController.getTokensByWorkerAccountInfo);
router.get("/", moon_accountController.getProfileByToken);

module.exports = router;
