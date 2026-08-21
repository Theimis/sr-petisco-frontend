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
            <div className="kpi-content">

                <div
                    className="kpi-icon-box"
                    style={{
                        background: bg,
                    }}
                >
                    <Icon
                        size={30}
                        color={color}
                        strokeWidth={1.8}
                    />
                </div>

                <div className="kpi-info">

                    <p className="kpi-title">
                        {title}
                    </p>

                    <h2 className="kpi-value">
                        {value}
                    </h2>

                    <div
                        className="kpi-trend"
                        style={{
                            color,
                        }}
                    >
                        <span className="kpi-trend-arrow">
                            ↑
                        </span>

                        <span>
                            {change}
                        </span>

                        <span className="kpi-period">
                            vs período anterior
                        </span>
                    </div>

                </div>

            </div>
        </motion.div>
    );
};