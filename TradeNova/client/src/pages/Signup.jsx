import { useState } from "react";
import { request } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await request("/api/auth/register", {
  method: "POST",
  body: form
});

      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Start your trading journey</p>

        <input
          placeholder="Name"
          style={styles.input}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          style={styles.input}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handleSignup} style={styles.button}>
          Signup
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #000, #0f172a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  overlay: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, #10b98133, transparent)",
    filter: "blur(120px)"
  },
  card: {
    backdropFilter: "blur(20px)",
    background: "rgba(255,255,255,0.05)",
    padding: "40px",
    borderRadius: "20px",
    width: "350px",
    boxShadow: "0 0 40px rgba(16,185,129,0.2)"
  },
  title: {
    color: "white"
  },
  subtitle: {
    color: "#aaa",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #222",
    background: "#0a0a0a",
    color: "white"
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg,#10b981,#22c55e)",
    color: "white",
    cursor: "pointer"
  },
  text: {
    marginTop: "15px",
    color: "#aaa",
    textAlign: "center"
  },
  link: {
    color: "#10b981"
  }
};