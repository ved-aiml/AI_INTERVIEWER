const express = require("express")
const router = express.Router()

const {
 startInterview,
 nextQuestion,
 submitAnswer,
 endInterview
} = require("../controllers/interviewController")

router.post("/start", startInterview)
router.post("/next", nextQuestion)
router.post("/answer", submitAnswer)
router.post("/end", endInterview)

module.exports = router