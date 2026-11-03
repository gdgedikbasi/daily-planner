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

  //haftanın her günü için tamamlanan görev sayısı
  const completedCounts=days.map((day)=>({
    date:day,
    count:(fixedTasks[day]||[]).filter((task)=>task.done).length,
  }));

  //çubukların yüksekliğini hesaplamak için en yüksek değer
  const maxCompleted=Math.max(
    1,
    ...completedCounts.map((day)=>day.count)
  );

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

      <div style={styles.chartContainer}>
        <h3>📊 Haftalık Tamamlanan Görevler</h3>

        <div style={styles.chart}>
          {completedCounts.map((day)=>(
            <div key={day.date} style={styles.barColumn}>
              <span style={styles.barValue}>{day.count}</span>
                <div style={styles.barTrack}>
                  <div 
                    style={{
                      ...styles.bar,
                      height:`${(day.count/maxCompleted)*100}%`,
                    }}
                  />      
                </div>
              <span style={styles.barLabel}>
                {day.date.slice(5)}
              </span>
            </div>
          ))}
        </div>

        <p style={styles.chartDescription}>
          Son 7 günde tamamladığın görev sayıları
        </p>
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

  
  chartContainer: {
    marginTop: 28,
    padding: 20,
    borderRadius: 16,
    background: "#111827",
  },

  chart: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: 12,
    height: 220,
    marginTop: 20,
  },

  barColumn: {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    minWidth: 0,
  },

  barValue: {
    fontSize: 13,
    color: "#d1d5db",
  },

  barTrack: {
    width: "100%",
    maxWidth: 42,
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
    background: "#1f2937",
    borderRadius: 8,
    overflow: "hidden",
  },

  bar: {
    width: "100%",
    minHeight: 0,
    background: "#10b981",
    borderRadius: 8,
    transition: "height 0.3s ease",
  },

  barLabel: {
    fontSize: 11,
    color: "#9ca3af",
  },

  chartDescription: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 16,
  },
};