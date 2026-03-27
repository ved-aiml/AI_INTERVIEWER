import { nanoid } from "nanoid";
import Session from "../models/Session.model.js";
import Answer from "../models/Answer.model.js";
import Report from "../models/Report.model.js";
import User from "../models/User.model.js";
import { sendInterviewLink } from "../services/email.service.js";

export const createSession = async (req, res) => {
  try {
    const { jobTitle, skills, experienceLevel, rounds, questionsPerRound, timeLimit } = req.body;
    if (!jobTitle || !skills || !experienceLevel) {
      return res.status(400).json({ message: "Job title, skills, and experience level are required" });
    }
    const shareableToken = nanoid(12);
    const session = await Session.create({
      recruiterId: req.user._id,
      jobTitle,
      skills: Array.isArray(skills) ? skills : skills.split(",").map((s) => s.trim()),
      experienceLevel,
      rounds: rounds || ["intro", "technical", "managerial"],
      questionsPerRound: questionsPerRound || 3,
      timeLimit: timeLimit || 30,
      shareableToken,
    });
    res.status(201).json(session);
  } catch (error) {
    console.error("Create session error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ recruiterId: req.user._id })
      .populate("candidateId", "name email")
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("recruiterId", "name email")
      .populate("candidateId", "name email");
    if (!session) return res.status(404).json({ message: "Session not found" });
    const answers = await Answer.find({ sessionId: session._id }).sort({ createdAt: 1 });
    const report = await Report.findOne({ sessionId: session._id });
    res.json({ session, answers, report });
  } catch (error) {
    console.error("Get session error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSessionByToken = async (req, res) => {
  try {
    const session = await Session.findOne({ shareableToken: req.params.token })
      .populate("recruiterId", "name");
    if (!session) return res.status(404).json({ message: "Invalid interview link" });
    res.json({
      _id: session._id,
      jobTitle: session.jobTitle,
      skills: session.skills,
      experienceLevel: session.experienceLevel,
      rounds: session.rounds,
      questionsPerRound: session.questionsPerRound,
      timeLimit: session.timeLimit,
      status: session.status,
      recruiterName: session.recruiterId?.name || "Recruiter",
    });
  } catch (error) {
    console.error("Get session by token error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const logProctoringEvent = async (req, res) => {
  try {
    const { sessionId, eventType, details, scorePenalty, frameData } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!session.proctoring) {
      session.proctoring = { tabSwitches: 0, copyPasteAttempts: 0, trustScore: 100, isSuspicious: false, logs: [] };
    }

    let penalty = scorePenalty || 0;
    if (!scorePenalty) {
      if (eventType === "tab-switch") {
        session.proctoring.tabSwitches += 1;
        penalty = 5;
      } else if (eventType === "copy-paste") {
        session.proctoring.copyPasteAttempts += 1;
        penalty = 10;
      } else if (eventType === "face-event") {
        penalty = details.includes("Multiple") ? 20 : 10;
      }
    }

    if (eventType === "Tab Switch" || eventType === "tab-switch") session.proctoring.tabSwitches += 1;
    if (eventType === "Copy/Paste" || eventType === "copy-paste") session.proctoring.copyPasteAttempts += 1;

    session.proctoring.trustScore = Math.max(0, session.proctoring.trustScore - penalty);
    if (session.proctoring.trustScore < 60) {
      session.proctoring.isSuspicious = true;
    }

    session.proctoring.logs.push({
      event: `${eventType}: ${details}`,
      timestamp: new Date(),
      frameImage: frameData || null
    });

    await session.save();
    res.json({ message: "Event logged", proctoring: session.proctoring });
  } catch (error) {
    console.error("Log proctoring event error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await User.find({ role: "candidate" }).select("name email profile");
    res.json(candidates);
  } catch (error) {
    console.error("Get candidates error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendInterviewEmail = async (req, res) => {
  try {
    const { email, candidateName, jobTitle, interviewLink } = req.body;
    if (!email || !candidateName || !jobTitle || !interviewLink) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await sendInterviewLink(email, candidateName, jobTitle, interviewLink);
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Send email error:", error.message);
    if (error.message.includes("credentials missing")) {
      res.status(503).json({ message: "Email service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD." });
    } else if (error.message.includes("timed out")) {
      res.status(504).json({ message: "Email sending timed out. Please try again later." });
    } else {
      res.status(500).json({ message: "Failed to send email. Check SMTP settings." });
    }
  }
};
