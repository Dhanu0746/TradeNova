export default function Stats() {
  return (
    <section style={styles.section}>
      <div style={styles.grid}>
        <div>
          <h2>1M+</h2>
          <p>Users</p>
        </div>

        <div>
          <h2>$12B+</h2>
          <p>Trades</p>
        </div>

        <div>
          <h2>99.9%</h2>
          <p>Uptime</p>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "60px",
    textAlign: "center"
  },
  grid: {
    display: "flex",
    justifyContent: "space-around"
  }
};