const Interview = require("../models/Interview")
const asyncHandler = require("../middleware/asyncHandler")


// START INTERVIEW
exports.startInterview = asyncHandler(async (req, res) => {

    const { userId, role, experienceLevel } = req.body

    const interview = await Interview.create({
        userId,
        role,
        experienceLevel
    })

    res.status(201).json(interview)

})



// GET NEXT QUESTION
exports.nextQuestion = asyncHandler(async (req, res) => {

    const { interviewId } = req.body

    const interview = await Interview.findById(interviewId)

    if (!interview) {
        res.status(404)
        throw new Error("Interview not found")
    }

    res.json({
        message: "Question generation will happen here"
    })

})



// SUBMIT ANSWER
exports.submitAnswer = asyncHandler(async (req, res) => {

    const { interviewId, answer } = req.body

    const interview = await Interview.findById(interviewId)

    if (!interview) {
        res.status(404)
        throw new Error("Interview not found")
    }

    res.json({
        message: "Answer received"
    })

})



// END INTERVIEW
exports.endInterview = asyncHandler(async (req, res) => {

    const { interviewId } = req.body

    const interview = await Interview.findById(interviewId)

    if (!interview) {
        res.status(404)
        throw new Error("Interview not found")
    }

    interview.status = "completed"
    interview.endTime = new Date()

    await interview.save()

    res.json({
        message: "Interview ended",
        interview
    })

})