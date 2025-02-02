const router = require("express").Router();
const multer = require("multer");
const paymentController = require("../../../controllers/moonlight_payment");
const upload = multer({ storage: multer.memoryStorage() });

// 현재 /guest 사용 중
router.post(
  "/upload",
  upload.array("files"),
  paymentController.uploadPayment_InfoFbStorage
);

router.get("/many", paymentController.getPayment_InfoMany);
router.get("/", paymentController.getPayment_InfoOne);
// router.put("/update", paymentController.updateMoonlightpaymentNameNum);
router.delete("/", paymentController.deletePayment_Info);
// router.delete("/hotel", paymentController.deleteMoonlightGuestbyHotelID);

module.exports = router;
