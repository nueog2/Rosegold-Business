const router = require("express").Router();
const hotelRouter = require("./hotel");
const accountRouter = require("./account");
// const moonRouter = require("./moonlight");
const auth_util = require("../middlewares/auth_util");

router.use("/hotel", hotelRouter);
router.use("/account", accountRouter);
// router.use("/moonlight", moonRouter);

module.exports = router;
