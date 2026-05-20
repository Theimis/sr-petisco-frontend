import { motion } from "framer-motion";
import "./kpiCard.css";

interface KPICardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    color: string;
    bg: string;
}

export const KPICard = ({
    title,
    value,
    change,
    icon: Icon,
    color,
    bg,
}: KPICardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="kpi-card"
        >
            <div className="kpi-header">
                <div
                    className="kpi-icon-box"
                    style={{ background: bg }}
                >
                    <Icon size={22} color={color} />
                </div>

                <div
                    className="kpi-trend"
                    style={{ color }}
                >
                    {change}
                </div>
            </div>

            <div className="kpi-value-group">
                <p>{title}</p>
                <h2>{value}</h2>
            </div>

            <div className="kpi-chart-mini">
                {[20, 35, 25, 40, 30, 45, 28, 38].map((h, i) => (
                    <div
                        key={i}
                        className="chart-bar"
                        style={{
                            height: `${h}%`,
                            backgroundColor: color,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};