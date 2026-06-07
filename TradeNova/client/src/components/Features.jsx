export default function Features() {
  const features = [
    {
      title: "Live Market Data",
      desc: "Track real-time stock prices instantly"
    },
    {
      title: "Smart Portfolio",
      desc: "Analyze profits, losses and allocation"
    },
    {
      title: "AI Insights",
      desc: "Get smart investment suggestions"
    }
  ];

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Why TradeNova?</h2>

      <div style={styles.grid}>
        {features.map((f, i) => (
          <div key={i} style={styles.card}>
            <h3>{f.title}</h3>
            <p style={{ color: "#aaa" }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "80px",
    textAlign: "center"
  },
  title: {
    fontSize: "32px",
    marginBottom: "40px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px"
  },
  card: {
    background: "#111",
    padding: "30px",
    borderRadius: "16px",
    border: "1px solid #222"
  }
};