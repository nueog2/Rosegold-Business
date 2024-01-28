const router = require("express").Router()
const hotelRouter = require("./hotel")

router.use("/hotel", hotelRouter)
module.exports = router