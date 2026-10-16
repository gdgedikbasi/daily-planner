export default function Sidebar({active, setActive}) {
    return(
        <div style={styles.sidebar}>
            <h2 style={{marginBottom:30}}>📅 Planner</h2>
            <p style={active === "today" ? styles.active : styles.item}
               onClick={() => setActive("today")}>
            📌 Bugün
            </p>

            <p style={active === "weekly" ? styles.active : styles.item}
               onClick={() => setActive("weekly")}>
            📆 Haftalık
            </p>

            <p style={active === "stats" ? styles.active : styles.item}
               onClick={() => setActive("stats")}>
            📊 İstatistik
            </p>

            <p style={active === "settings" ? styles.active : styles.item}
               onClick={() => setActive("settings")}>
            ⚙️ Ayarlar
            </p>
        </div>
    );
}

const styles = {
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#111827",
    padding: "20px",
    color: "#fff",
  },

  item: {
    cursor: "pointer",
    padding: "10px",
    borderRadius: 8,
  },

  active: {
    cursor: "pointer",
    padding: "10px",
    borderRadius: 8,
    background: "#6366f1",
  },
};