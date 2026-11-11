import {useMemo} from "react";
import {calculateStats} from "../utils/taskStats";
import{
    ListTodo,
    CheckCircle2,
    Clock3,
    TrendingUp,
    ChartNoAxesCombined,
} from "lucide-react";

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

    //istatistik kartları 
    const statCards=[
        {
            title:"Toplam Görev",
            value:stats.total,
            icon:ListTodo,
            color:"#60a5fa",
            background: "rgba(96, 165, 250, 0.12)",
        },

        {
            title:"Tamamlanan",
            value:stats.done,
            icon:CheckCircle2,
            color:"#4ade80",
            background:"rgba(74,222,128,0.12)",
        },

        {
            title:"Bekleyen",
            value:stats.pending,
            icon:Clock3,
            color:"#fbbf24",
            background:"rgba(251,191,36,0.12)",
        },

        {
            title:"Tamamlanma Oranı",
            value:`%${stats.percent}`,
            icon:TrendingUp,
            color:"#a78bfa",
            background:"rgba(167,139,250,0.12)",
        },
    ];

    return(
        <div style={styles.container}>

            {/*Başlık*/}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.heading}>İstatistikler</h2>
                    <p style={styles.description}>Görev performansına genel bir bakış.</p>    
                </div> 

                <div style={styles.headerIcon}>
                    <ChartNoAxesCombined size={25} color="#a5b4fc"/>
                </div> 
            </div>

            {/*İstatistik kartları*/}
            <div style={styles.cardGrid}>
                {statCards.map((card)=>{
                    const Icon=card.icon;

                    return(
                        <div key={card.title} style={styles.card}>
                            <div style={styles.cardTop}>
                                <span style={styles.cardTitle}>{card.title}</span>

                                <div 
                                    style={{
                                        ...styles.cardIcon,
                                        background: card.background,
                                    }}
                                >
                                    <Icon size={21} color={card.color}/>
                                </div>
                            </div>

                            <h3
                                style={{
                                    ...styles.cardValue,
                                    color:card.color,
                                }}
                            >
                                {card.value}
                            </h3>
                        </div>
                    );
                })};
            </div>

            {/*Genel İlerleme*/}
            <div style={styles.progressCard}>
                <div style={styles.progressHeader}>
                    <div>
                        <h3 style={styles.sectionTitle}>
                            Genel İlerleme
                        </h3>
                        <p style={styles.mutedText}>
                            Tamamlanan görevlerin toplam görevleme oranı
                        </p>
                    </div>

                    <span style={styles.progressPercent}>
                        %{stats.percent}
                    </span>
                </div>

                <div style={styles.progressTrack}>
                    <div 
                        style={{
                            ...styles.progressFill,
                            width:`${stats.percent}%`,
                        }}
                    />
                </div>
            </div>
        
            {/* Haftalık grafik */}
            <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                    <div>
                        <h3 style={styles.sectionTitle}>
                            Son 7 Gün
                        </h3>
                        <p style={styles.mutedText}>
                            Günlük tamamlanan görevler
                        </p>
                    </div>

                    <div style={styles.chartBadge}>
                        <TrendingUp size={15} color="#a78bfa" />
                        <span>Haftalık</span>
                    </div>
                </div>

                <div style={styles.chart}>
                    {weeklyStats.map((day) => {
                        const barHeight =
                        day.done === 0
                            ? 0
                            : (day.done / maxCompleted) * 100;

                        return (
                        <div key={day.date} style={styles.barColumn}>
                            <span style={styles.barValue}>
                            {day.done}
                            </span>

                            <div style={styles.barArea}>
                            <div
                                style={{
                                ...styles.bar,
                                height: `${barHeight}%`,
                                opacity: day.done === 0 ? 0.3 : 1,
                                }}
                                title={`${day.date}: ${day.done} görev`}
                            />
                            </div>

                            <span style={styles.dayLabel}>
                            {day.label}
                            </span>
                        </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const styles = {
  container: {
    padding: "clamp(12px,3w,25px)",
    color: "#f8fafc",
    width: "100%",
    boxSizing: "border-box",
    minWidth:0,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },

  heading: {
    margin: "0 0 8px",
    fontSize: "26px",
    fontWeight: "700",
    color: "#f8fafc",
  },

  description: {
    margin: 0,
    fontSize: "14px",
    color: "#94a3b8",
  },

  headerIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "rgba(99, 102, 241, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,180px),1fr))",
    gap: "16px",
    marginBottom: "20px",
    width:"100%",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid #334155",
    minWidth: 0,
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "18px",
  },

  cardTitle: {
    color: "#cbd5e1",
    fontSize: "13px",
  },

  cardIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardValue: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
  },

  progressCard: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "22px",
    marginBottom: "20px",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: "0 0 6px",
    fontSize: "17px",
    color: "#f8fafc",
  },

  mutedText: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
  },

  progressPercent: {
    color: "#a78bfa",
    fontSize: "20px",
    fontWeight: "700",
  },

  progressTrack: {
    height: "10px",
    width: "100%",
    background: "#334155",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #6366f1, #a78bfa)",
    borderRadius: "20px",
    transition: "width 0.4s ease",
  },

  chartCard: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "22px",
  },

  chartHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
  },

  chartBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 10px",
    background: "rgba(167, 139, 250, 0.12)",
    borderRadius: "9px",
    color: "#c4b5fd",
    fontSize: "12px",
  },

  chart: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-around",
    gap: "12px",
    height: "190px",
    overflowX:"auto",
    paddingBottom:"5px",
  },

  barColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "9px",
    height: "100%",
    flex: "1 0 35px",
    minWidth: "35px",
  },

  barValue: {
    fontSize: "13px",
    color: "#cbd5e1",
  },

  barArea: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
    height: "125px",
    background: "#273449",
    borderRadius: "7px",
    overflow: "hidden",
  },

  bar: {
    width: "55%",
    minHeight: "0",
    background: "linear-gradient(180deg, #a78bfa, #6366f1)",
    borderRadius: "6px 6px 0 0",
    transition: "height 0.4s ease",
  },

  dayLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    textTransform: "capitalize",
  },
};