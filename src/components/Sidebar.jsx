export default function Sidebar({active, setActive, isOpen, onClose}) {
    const handleNavigation=(view)=>{
      setActive(view);
      onClose();
    };

    return (
    <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <h2>📅 Planner</h2>
        <button className="sidebar-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <p
        className={active === "today" ? "sidebar-item active" : "sidebar-item"}
        onClick={() => handleNavigation("today")}
      >
        📌 Bugün
      </p>

      <p
        className={active === "weekly" ? "sidebar-item active" : "sidebar-item"}
        onClick={() => handleNavigation("weekly")}
      >
        📆 Haftalık
      </p>

      <p
        className={active === "stats" ? "sidebar-item active" : "sidebar-item"}
        onClick={() => handleNavigation("stats")}
      >
        📊 İstatistik
      </p>

      <p
        className={active === "settings" ? "sidebar-item active" : "sidebar-item"}
        onClick={() => handleNavigation("settings")}
      >
        ⚙️ Ayarlar
      </p>
    </div>
  );
}

