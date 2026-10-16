import { useMemo } from "react";

export default function WeeklyView({ selectedDate, setSelectedDate }) {

  // 🔥 localStorage'dan taskları çek
  const allTasks = JSON.parse(localStorage.getItem("tasksByDate") || "{}");

  // ✅ DATE FORMAT (STRING → YYYY-MM-DD)
  const formatDate = (d) =>
    typeof d === "string"
      ? d
      : new Date(d).toLocaleDateString("sv-SE");

  // ✅ TÜM TASKLARI DÜZGÜN FORMATTA TOPLA
  const fixedTasks = useMemo(() => {
    const fixed = {};

    Object.entries(allTasks).forEach(([date, tasks]) => {
      const newKey = formatDate(date);

      if (!fixed[newKey]) fixed[newKey] = [];
      fixed[newKey].push(...tasks);
    });

    return fixed;
  }, [allTasks]);

  // 📆 HAFTA (selectedDate merkez)
  const days = useMemo(() => {
    const [year, month, day] = selectedDate.split("-");
    const base = new Date(year, month - 1, day); // 🔥 LOCAL DATE

    const week = [];

    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      week.push(formatDate(d));
    }

    return week;
  }, [selectedDate]);

  // 📅 TODAY CHECK
  const isToday = (day) =>
    day === new Date().toLocaleDateString("sv-SE");

  const selectedKey = formatDate(selectedDate);

  return (
    <div style={styles.container}>
      <h2>📆 Haftalık Görünüm</h2>

      <div style={styles.grid}>
        {days.map((day) => {
          const dayTasks = (fixedTasks[day] || [])
            .slice()
            .sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              return 0;
            });

          return (
            <div
              key={day}
              onClick={() => setSelectedDate(day)} // ✅ FIX
              style={{
                padding: 10,
                borderRadius: 12,
                background:
                  selectedKey === day
                    ? "#374151"
                    : isToday(day)
                    ? "#1f2937"
                    : "#111827",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{day}</span>
                {isToday(day) && (
                  <span style={styles.today}>TODAY</span>
                )}
              </div>

              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                {dayTasks.length} görev
              </div>

              {selectedKey === day && (
                <div style={styles.dropdown}>
                  {dayTasks.length === 0 && (
                    <div style={styles.empty}>Görev yok</div>
                  )}

                  {dayTasks.map((t) => (
                    <div key={t.id} style={styles.taskCard}>
                      <span style={styles.icon}>
                        {t.done ? "✅" : "⬜"}
                      </span>

                      <span style={styles.text(t.done)}>
                        {t.text}
                      </span>

                      {t.pinned && (
                        <span style={styles.pin}>📌</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 🎨 UI
const styles = {
  container: {
    color: "#fff",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 10,
    marginTop: 20,
  },

  dropdown: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  taskCard: {
    background: "#1f2937",
    padding: "10px 12px",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
  },

  text: (done) => ({
    flex: 1,
    textDecoration: done ? "line-through" : "none",
    opacity: done ? 0.5 : 1,
    fontSize: 14,
  }),

  today: {
    fontSize: 10,
    background: "#10b981",
    padding: "2px 6px",
    borderRadius: 6,
  },

  pin: {
    fontSize: 12,
    opacity: 0.8,
  },

  icon: {
    fontSize: 14,
  },

  empty: {
    fontSize: 12,
    color: "#9ca3af",
  },
};