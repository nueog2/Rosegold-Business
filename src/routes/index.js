const express = require('express');
const router = express.Router();
const hotelRouter = require("./hotel");
const accountRouter = require("./account");
const moonRouter = require("./moon_light");
const auth_util = require("../middlewares/auth_util");
const lockerRoutes = require('./lockerRoutes');

//주서린 추가
// const moonlightStorage2 = require("../controllers/moonlight_storage2");

router.use("/hotel", hotelRouter);
router.use("/account", accountRouter);
router.use("/moon_light", moonRouter);

// storage2 라우트 수정 - prefix 제거
// router.get("/storage2", moonlightStorage2.getStorageMany);
// router.post("/storage2", moonlightStorage2.createStorage);

router.use('/api', lockerRoutes);

module.exports = router;
