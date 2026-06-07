export default function Footer() {
  return (
    <footer style={styles.footer}>
      <h2>TradeNova</h2>
      <p>Modern Stock Trading Platform © 2026</p>
    </footer>
  );
}

const styles = {
  footer: {
    background: "#050505",
    color: "#999",
    padding: "40px",
    textAlign: "center"
  }
};