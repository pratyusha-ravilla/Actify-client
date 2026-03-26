import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import axiosClient from "../utils/axiosClient";
import HomeNavbar from "../components/HomeNavbar";
import "./ContactPage.css";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axiosClient.post("/contact", form);

      alert("Message sent successfully ✅");
      setForm({ name: "", email: "", message: "" });
    } catch {
      alert("Failed to send message ❌");
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <>
  //     {/* <HomeNavbar /> */}

  //     <Box sx={{ maxWidth: 600, mx: "auto", mt: 8 }}>
  //       <Paper sx={{ p: 4, borderRadius: 4 }}>
  //         <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
  //           Contact Us 📩
  //         </Typography>

  //         <TextField
  //           fullWidth
  //           label="Your Name"
  //           name="name"
  //           value={form.name}
  //           onChange={handleChange}
  //           sx={{ mb: 2 }}
  //         />

  //         <TextField
  //           fullWidth
  //           label="Email"
  //           name="email"
  //           value={form.email}
  //           onChange={handleChange}
  //           sx={{ mb: 2 }}
  //         />

  //         <TextField
  //           fullWidth
  //           label="Message"
  //           name="message"
  //           multiline
  //           rows={4}
  //           value={form.message}
  //           onChange={handleChange}
  //           sx={{ mb: 3 }}
  //         />

  //         <Button
  //           fullWidth
  //           variant="contained"
  //           onClick={handleSubmit}
  //           disabled={loading}
  //           sx={{
  //             borderRadius: 3,
  //             fontWeight: 700,
  //             background: "linear-gradient(135deg,#7c3aed,#5b21b6)"
  //           }}
  //         >
  //           {loading ? "Sending..." : "Send Message"}
  //         </Button>
  //       </Paper>
  //     </Box>
  //   </>
  // );

return (
  <Box className="contact-page">
    <Box className="contact-card">
      
      <Typography className="contact-title">
        Contact Us 📩
      </Typography>

      <TextField
        fullWidth
        label="Your Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="contact-input"
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        className="contact-input"
      />

      <TextField
        fullWidth
        label="Message"
        name="message"
        multiline
        rows={4}
        value={form.message}
        onChange={handleChange}
        className="contact-input"
      />

      <Button
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
        className="contact-button"
      >
        {loading ? "Sending..." : "Send Message"}
      </Button>

    </Box>
  </Box>
);


}