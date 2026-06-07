export default function Hero() {
  return (
    <section style={styles.hero}>
      <div style={styles.glow}></div>

      <div style={styles.container}>
        {/* LEFT */}
        <div style={styles.left}>
          <h1 style={styles.title}>
            Trade Smarter.<br />Grow Faster.
          </h1>

          <p style={styles.subtitle}>
            Real-time stock trading platform with AI insights,
            portfolio tracking, and fast execution.
          </p>

          <div style={styles.buttons}>
            <button style={styles.primary}>Get Started</button>
            <button style={styles.secondary}>Login</button>
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.preview}>
          <div style={styles.card}>
            <h3>Portfolio Value</h3>
            <h1>$84,520</h1>
            <p style={{ color: "#10b981" }}>+2.3% Today</p>

            <div style={styles.stock}>
              <span>AAPL</span>
              <span style={{ color: "#10b981" }}>+2.3%</span>
            </div>

            <div style={styles.stock}>
              <span>TSLA</span>
              <span style={{ color: "#ef4444" }}>-1.1%</span>
            </div>

            <div style={styles.stock}>
              <span>NVDA</span>
              <span style={{ color: "#10b981" }}>+4.8%</span>
            </div>

            <button style={styles.dashboardBtn}>
              Open Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    padding: "60px",
    position: "relative"
  },
  glow: {
    position: "absolute",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, #10b98133, transparent)",
    filter: "blur(120px)",
    top: "10%",
    left: "20%",
    zIndex: 0
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center",
    width: "100%",
    zIndex: 2
  },
  left: {},
  title: {
    fontSize: "56px",
    fontWeight: "bold"
  },
  subtitle: {
    marginTop: "20px",
    color: "#aaa",
    maxWidth: "500px"
  },
  buttons: {
    marginTop: "30px",
    display: "flex",
    gap: "10px"
  },
  primary: {
    padding: "14px 24px",
    background: "#10b981",
    border: "none",
    borderRadius: "10px",
    color: "white"
  },
  secondary: {
    padding: "14px 24px",
    background: "#111",
    border: "1px solid #222",
    borderRadius: "10px",
    color: "white"
  },
  preview: {
    display: "flex",
    justifyContent: "center"
  },
  card: {
    background: "#111",
    padding: "30px",
    borderRadius: "16px",
    width: "300px",
    boxShadow: "0 0 40px #10b98133"
  },
  stock: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },
  dashboardBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "10px",
    background: "#10b981",
    border: "none",
    borderRadius: "8px",
    color: "white"
  }
};