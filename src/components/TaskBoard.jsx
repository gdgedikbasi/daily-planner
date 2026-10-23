import { useState, useEffect, useMemo } from "react";
import { CheckCircle, Circle, Trash2, Pin } from "lucide-react";
import { Reorder, motion } from "framer-motion";
import { calculateStats } from "../utils/taskStats";

export default function TaskBoard({ selectedDate }) {
  const [task, setTask] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filter,setFilter]=useState("all");

  const [allTasks, setAllTasks] = useState(() => {
    const saved = localStorage.getItem("tasksByDate");
    return saved ? JSON.parse(saved) : {};
  });

  const today = selectedDate;
  const tasks = useMemo(() => allTasks[today] || [], [allTasks, today]);

  const sortedTasks = useMemo(() => {
    const priorityOrder = {
      high: 0,
      medium: 1,
      low: 2,
    };

    return [...tasks].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      return (
        (priorityOrder[a.priority] ?? 1) -
        (priorityOrder[b.priority] ?? 1)
      );
    });
  }, [tasks]);
  
  const filteredTasks=useMemo(()=>{
    return sortedTasks.filter((t)=>{
      //görev adına göre arama
      const matchesSearch=t.text
        .toLocaleLowerCase("tr-TR")
        .includes(searchQuery.toLocaleLowerCase("tr-TR"));

      //tamamlanma durumuna göre filtreleme
      const matchesFilter=
        filter==="all" ||
        (filter==="active" && !t.done) ||
        (filter==="completed" && t.done);

      return matchesSearch && matchesFilter;
    });
  }, [sortedTasks,searchQuery,filter]);

  useEffect(() => {
    localStorage.setItem("tasksByDate", JSON.stringify(allTasks));
  }, [allTasks]);

  // ✅ SAFE STATE UPDATE
  const updateTasks = (newTasks) => {
    setAllTasks((prev) => ({
      ...prev,
      [today]: newTasks,
    }));
  };

  const addTask = () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now(),
      text: task,
      done: false,
      createdAt: new Date().toISOString(),
      pinned: false,
      priority: "medium",
    };

    updateTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleTask = (id) => {
    updateTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = (id) => {
    updateTasks(tasks.filter((t) => t.id !== id));
  };

  const togglePin = (id) => {
    updateTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, pinned: !t.pinned } : t
      )
    );
  };

  const changePriority = (id) => {
    const order = ["low", "medium", "high"];
    updateTasks(
      tasks.map((t) => {
        if (t.id !== id) return t;
        const next =
          order[(order.indexOf(t.priority) + 1) % order.length];
        return { ...t, priority: next };
      })
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { total, done, pending, percent } = calculateStats(tasks);


  return (
    <div style={styles.container}>
      <h2>Bugün ne yapacaksın?</h2>

      <div style={styles.progressBox}>
        <div key={percent}>{percent}% tamamlandı</div>
        <div style={styles.progressBar}>
          <div
            style={{ ...styles.progressFill, width: percent + "%" }}
          />
        </div>
      </div>

      {/*Gelişmiş İstatistikler*/}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Toplam Görev</div>
          <div style={styles.statValue}>{total}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Tamamlanan</div>
          <div style={styles.statValue}>{done}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Bekleyen</div>
          <div style={styles.statValue}>{pending}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Başarı Oranı</div>
          <div style={styles.statValue}>%{percent}</div>
        </div>
      </div>


      {/*Görev Arama*/}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Görev ara..."
          value={searchQuery}
          onChange={(e)=>setSearchQuery(e.target.value)}
          style={styles.input}
        />
      </div>

      {/*Görev Filtreleme*/}
      <div style={styles.filterBox}>
        {[
          {value:"all",label:"Tümü"},
          {value:"active",label:"Bekleyen"},
          {value:"completed",label:"Tamamlanan"},
        ].map((item)=>(
          <button
            key={item.value}
            onClick={()=>setFilter(item.value)}
            style={{
              ...styles.filterButton,
              ...(filter===item.value
                ? styles.activeFilter
                :{}),
            }}
          >
            {item.label}
          </button>
        ))}
      </div>


      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && task.trim()) {
              addTask();
            }
          }}
        />
        <button onClick={addTask} style={styles.button}>
          Ekle
        </button>
      </div>

      <Reorder.Group
        axis="y"
        values={filteredTasks}
        onReorder={(newOrder) => updateTasks(newOrder)}
        style={{ listStyle: "none", padding: 0, marginTop: 20 }}
      >
        {filteredTasks.map((t) => (
          <Reorder.Item key={t.id} value={t} dragListener={filter === "all" && !searchQuery.trim()}>
            <motion.div
              layout
              style={{
                ...styles.task,
                borderLeft: `4px solid ${
                  t.priority === "high"
                    ? "#ef4444"
                    : t.priority === "medium"
                    ? "#f59e0b"
                    : "#6b7280"
                }`,
              }}
            >
              <div onClick={() => toggleTask(t.id)}>
                {t.done ? <CheckCircle /> : <Circle />}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    textDecoration: t.done
                      ? "line-through"
                      : "none",
                  }}
                >
                  {t.text}
                </div>

                {t.createdAt && (
                  <small style={styles.date}>
                    ⏰ {formatDate(t.createdAt)}
                  </small>
                )}
              </div>

              {/* ✅ PRIORITY BUTTON */}
              <button
                onClick={() => changePriority(t.id)}
                style={styles.priorityBtn}
              >
                {t.priority}
              </button>

              <Pin
                size={18}
                onClick={() => togglePin(t.id)}
                style={{
                  color: t.pinned ? "gold" : "gray",
                  cursor: "pointer",
                }}
              />

              <Trash2
                size={18}
                onClick={() => deleteTask(t.id)}
                style={{ cursor: "pointer" }}
              />
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: "40px auto",
    padding: 20,
    borderRadius: 16,
    background: "#111827",
    color: "#f9fafb",
  },
  inputBox: {
    display: "flex",
    gap: 10,
    marginTop: 15,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    background: "#1f2937",
    color: "#fff",
  },
  button: {
    padding: "10px 16px",
    borderRadius: 8,
    background: "#6366f1",
    color: "#fff",
  },
  task: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    background: "#1f2937",
  },
  progressBox: {
    marginTop: 10,
    minWidth: 0,
    overflow: "visible",
  },
  
  progressBar: {
    height: 10,
    background: "#374151",
    borderRadius: 10,
  },
  progressFill: {
    height: "100%",
    background: "#22c55e",
  },
  date: {
    color: "#9ca3af",
    fontSize: 12,
  },
  priorityBtn: {
    background: "#374151",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
  },

  searchBox:{
    marginTop:15,
  },

  filterBox:{
    display:"flex",
    gap:8,
    marginTop:12,
    marginBottom:15,
    flexWrap:"wrap",
  },

  filterButton: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #374151",
    background: "#1f2937",
    color: "#d1d5db",
    cursor: "pointer",
  },

  activeFilter: {
    background: "#6366f1",
    color: "#ffffff",
    border: "1px solid #6366f1",
  },

    statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },

  statCard: {
    padding: 16,
    borderRadius: 12,
    background: "#1f2937",
    border: "1px solid #374151",
  },

  statLabel: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 8,
  },

  statValue: {
    color: "#f9fafb",
    fontSize: 26,
    fontWeight: "bold",
  },
};