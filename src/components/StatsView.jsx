import {useMemo} from "react";
import {calculateStats} from "../utils/taskStats";

export default function StatsView({allTasks}){
    //tüm günlerdeki görevleri tek bir dizide topluyorum.
    const tasks=useMemo(()=>{
        return Object.values(allTasks).flat();
    }, [allTasks]);

    //genel istatistikleri hesaplıyorum
    const stats=useMemo(()=>{
        return calculateStats(tasks);
    },[tasks]);

    //son 7 günün tamamlanan görev sayılarını hesaplıyorum
    const weeklyStats=useMemo(()=>{
        return Array.from({length:7},(_,index)=>{
            const date=new Date();
            date.setDate(date.getDate()-(6-index));

            const dateKey=date.toLocaleDateString("sv-SE");
            const dayTasks=allTasks[dateKey] || [];

            return{
                date:dateKey,
                label:date.toLocaleDateString("tr-TR",{
                    weekday:"short"
                }),
                total:dayTasks.length,
                done:dayTasks.filter((task)=>task.done).length,
            };
        });
    },[allTasks]);

    const maxCompleted=Math.max(
        1,
        ...weeklyStats.map((day)=>day.done)
    );

    const statCards=[
        {
            title:"Toplam Görev",
            value:stats.total,
            color:"#64748b",
        },

        {
            title:"Tamamlanan",
            value:stats.done,
            color:"#22c55e",
        },

        {
            title:"Bekleyen",
            value:stats.pending,
            color:"#f59e0b",
        },

        {
            title:"Tamamlanma Oranı",
            value:`%${stats.percent}`,
            color:"#8b5cf6",
        },
    ];

    return(
        <div style={styles.container}>
            <h2 style={styles.heading}>İstatistikler</h2>
            <p style={styles.description}>Görev performansına genel bir bakış.</p>

            <div style={styles.cardGrid}>
                {statCards.map((card)=>(
                    <div
                        key={card.title}
                        style={{...styles.card,borderLeft:`4px solid ${card.color}`,
                    }}    
                    >
                        <p style={styles.cardTitle}>{card.title}</p>
                        <h2 style={styles.cardValue}>{card.value}</h2>
                    </div>
                ))}
            </div>

            <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Son 7 Gün</h3>
                <div style={styles.chart}>
                    {weeklyStats.map((day)=>{
                        const barHeight=
                            day.done===0
                            ?4 
                            :(day.done/maxCompleted)*100;

                        return(
                            <div key={day.date} style={styles.barColumn}>
                                <span style={styles.barValue}>{day.done}</span>

                                <div style={styles.barArea}>
                                    <div style={styles.barArea}>
                                        <div
                                            style={{
                                            ...styles.bar,
                                            height: `${barHeight}%`,
                                            }}
                                            title={`${day.date}: ${day.done} görev`}
                                        />
                                    </div>
                                    <span style={styles.dayLabel}>{day.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>      
        </div>
    );
}

const styles={
    container: {
    padding: "25px",
    color: "var(--text-color, #1e293b)",
  },

  heading: {
    margin: "0 0 8px",
    fontSize: "26px",
  },

  description: {
    margin: "0 0 25px",
    color: "#94a3b8",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },

  card: {
    background: "var(--card-bg, #ffffff)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    margin: "0 0 12px",
    color: "#94a3b8",
    fontSize: "14px",
  },

  cardValue: {
    margin: 0,
    fontSize: "28px",
  },

  chartCard: {
    background: "var(--card-bg, #ffffff)",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  chartTitle: {
    margin: "0 0 25px",
    fontSize: "18px",
  },

  chart: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: "12px",
    height: "180px",
  },

  barColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
    height: "100%",
    flex: 1,
  },

  barValue: {
    fontSize: "13px",
    color: "#94a3b8",
  },

  barArea: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    height: "120px",
  },

  bar: {
    width: "min(42px, 75%)",
    minHeight: "4px",
    background: "#8b5cf6",
    borderRadius: "6px 6px 0 0",
    transition: "height 0.3s ease",
  },

  dayLabel: {
    fontSize: "13px",
    color: "#94a3b8",
    textTransform: "capitalize",
  },
};