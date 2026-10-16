export default function AIPanel() {
  return (
    <div style={styles.panel}>
      <h3>🤖 AI Asistan</h3>

      <p>Bugün verimliliğin: %60</p>
      <p>⚠️ 2 görev eksik</p>

      <div style={styles.box}>
        "Bugün biraz az çalıştın, 2 görev daha ekleyebilirsin."
      </div>
    </div>
  );
}

const styles = {
  panel: {
    width: "250px",
    height: "100vh",
    background: "#111827",
    padding: 20,
  },
  box: {
    marginTop: 20,
    padding: 10,
    background: "#1f2937",
    borderRadius: 10,
  },
};