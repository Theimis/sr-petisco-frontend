import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
} from "recharts";

import "./salesChart.css";

const data = [
    { name: "Seg", vendas: 4000 },
    { name: "Ter", vendas: 3000 },
    { name: "Qua", vendas: 5000 },
    { name: "Qui", vendas: 2780 },
    { name: "Sex", vendas: 1890 },
    { name: "Sab", vendas: 6390 },
    { name: "Dom", vendas: 3490 },
];

export const SalesChart = () => {
    return (
        <div className="sales-chart-card">
            <div className="sales-chart-header">
                <div>
                    <h3>Visão Geral de Vendas</h3>
                    <p>Últimos 7 dias</p>
                </div>

                <h2>R$ 26.550</h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient
                            id="colorSales"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#8b5cf6"
                                stopOpacity={0.4}
                            />
                            <stop
                                offset="95%"
                                stopColor="#8b5cf6"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <XAxis
                        dataKey="name"
                        stroke="#71717a"
                    />

                    <Tooltip />

                    <Area
                        type="monotone"
                        dataKey="vendas"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorSales)"
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};