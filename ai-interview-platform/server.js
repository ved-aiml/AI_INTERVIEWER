const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const { errorHandler } = require("./middleware/errorMiddleware")

const app = express()

app.use(cors())
app.use(express.json())

const authRoutes = require("./routes/authRoutes")
const interviewRoutes = require("./routes/interviewRoutes")

app.use("/api/auth", authRoutes)
app.use("/api/interview", interviewRoutes)

// error middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected")

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})
.catch(err => console.log(err))