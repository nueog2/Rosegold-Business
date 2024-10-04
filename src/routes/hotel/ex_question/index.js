const Ex_QuestionController = require("../../../controllers/ex_question");
const router = require("express").Router();

router.post("/", Ex_QuestionController.createExQuestion);

router.get("/one", Ex_QuestionController.getExQuestionOne);

router.get("/many", Ex_QuestionController.getExQuestionMany);

router.put("/", Ex_QuestionController.updateExQuestion);

router.delete("/", Ex_QuestionController.deleteExQuestion);

module.exports = router;
