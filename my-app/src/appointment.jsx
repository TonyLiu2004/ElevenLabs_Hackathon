// AppointmentForm.jsx
import React, { useState, useEffect } from 'react';
import { createAppointment } from './firebase/appointments';
import { auth } from "./firebase/firebaseConfig";  // your firebase config
import { onAuthStateChanged } from "firebase/auth";

function AppointmentForm() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  async function handleSubmit(e) {
    if (!user) {
      alert("Please log in first.");
      return;
    }
    e.preventDefault();
    setLoading(true);
    const appointmentData = {
      date: e.target.date.value,
      time: e.target.time.value,
      userId: user.uid,
      userName: user.displayName,
      userEmail: user.email,
      doctorId: "doc123",
      doctorName: "Dr. Smith",
      status: "scheduled",
      notes: e.target.notes.value,
    };

    try {
      await createAppointment(appointmentData);
      alert("Appointment created");
    } catch (error) {
        console.log("ERROR")
        console.log(error)
        alert(`Failed to create appointment: ${error.message}`);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="date" type="date" required />
      <input name="time" type="time" required />
      <textarea name="notes" placeholder="Notes" />
      <button type="submit" disabled={loading}>{loading ? "Saving..." : "Book Appointment"}</button>
    </form>
  );
}

export default AppointmentForm;
