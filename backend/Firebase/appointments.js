import express from "express";
import { db, adminAuth } from "../services/firebase.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  const authHeader = req.headers.authorization;
  const idToken = authHeader?.split("Bearer ")[1];
  if (!idToken) return res.status(401).send("Missing token");

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const appointmentData = {
      ...req.body,
      userId: decoded.uid,
      userEmail: decoded.email,
      timestamp: new Date(),
    };

    await db.collection("Appointments").add(appointmentData);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
