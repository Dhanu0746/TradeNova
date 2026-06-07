import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("tradenova_token");

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>TradeNova</h2>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/signup" style={styles.primary}>Signup</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 60px"
  },
  logo: {
    color: "#10b981"
  },
  links: {
    display: "flex",
    gap: "20px"
  },
  link: {
    color: "#bbb",
    textDecoration: "none"
  },
  primary: {
    background: "#10b981",
    padding: "6px 14px",
    borderRadius: "8px",
    color: "white"
  }
};