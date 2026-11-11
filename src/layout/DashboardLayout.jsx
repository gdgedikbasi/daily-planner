import { useState,useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TaskBoard from "../components/TaskBoard";
import AIPanel from "../components/AIPanel";
import WeeklyView from "../components/WeeklyView";
import StatsView from "../components/StatsView";

export default function DashboardLayout() {
  const [active, setActive] = useState(
    ()=>localStorage.getItem("activeView")||"today"
  );

  useEffect(()=>{
    localStorage.setItem("activeView",active);
  },[active]);


  const [allTasks,setAllTasks]=useState(()=>{
    return JSON.parse(localStorage.getItem("tasksByDate")||"{}")
  });

  useEffect(()=>{
    localStorage.setItem("tasksByDate",JSON.stringify(allTasks));
  },[allTasks]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ STRING formatta tarih (bozmuyoruz)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("sv-SE")
  );

  // ✅ GÜN DEĞİŞTİRME (< >)
  const changeDay = (amount) => {
    setSelectedDate((prev) => {
      const [y, m, d] = prev.split("-").map(Number);

      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + amount);

      return date.toLocaleDateString("sv-SE");
    });
};

  return (
    <div className="dashboard-container" >
      <button 
        className="menu-toggle"
        onClick={()=>setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar 
        active={active} 
        setActive={setActive} 
        isOpen={isSidebarOpen}
        onClose={()=>setIsSidebarOpen(false)}
      />

      {/* ORTA ALAN */}
      <div className="dashboard-content"  >
        
        {/* 🔥 TARİH BAR */}
        <div className="date-bar" >
          <button
            onClick={() => changeDay(-1)}
            style={styles.arrowBtn}
          >
            ⬅️
          </button>

          <div style={styles.dateText}>
            {selectedDate}
          </div>

          <button
            onClick={() => changeDay(1)}
            style={styles.arrowBtn}
          >
            ➡️
          </button>

          <button
            onClick={() =>
              setSelectedDate(new Date().toLocaleDateString("sv-SE"))
            }
            style={styles.todayBtn}
          >
            Today
          </button>
        </div>

        {/* SAYFALAR */}
        {active === "today" &&(
          <TaskBoard
            selectedDate={selectedDate}
            allTasks={allTasks}
            setAllTasks={setAllTasks}
          />       
        )}

        {active === "weekly" && (
          <WeeklyView
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            allTasks={allTasks}
          />
        )}

        {active === "stats" && <StatsView allTasks={allTasks} />}
        {active === "settings" && <div>⚙️ Ayarlar</div>}
      </div>

      {/* SAĞ PANEL */}
      <AIPanel />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },

  content: {
    flex: 1,
    padding: "20px",
    background: "#030712",
    color: "#fff",
    overflowY: "auto",
  },

  dateBar: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center", // ORTALAR 🔥
  },

  arrowBtn: {
  fontSize: "22px",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
},

  dateText: {
    fontSize: "20px",
    fontWeight: "bold",
    minWidth: "140px",
    textAlign: "center",
  },

  todayBtn: {
    marginLeft: "10px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
  },
};