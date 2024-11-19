const router = require("express").Router();
const hotelRouter = require("./hotel");
const accountRouter = require("./account");
const moonRouter = require("./moon_light");
const auth_util = require("../middlewares/auth_util");

router.use("/hotel", hotelRouter);
router.use("/account", accountRouter);
router.use("/moon_light", moonRouter);

module.exports = router;
