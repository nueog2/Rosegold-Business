const router = require("express").Router();
const hotelRouter = require("./hotel");
const accountRouter = require("./account");
const auth_util = require("../middlewares/auth_util");

router.use("/hotel", auth_util.verifyToken, hotelRouter);
router.use("/account", accountRouter);

module.exports = router;
