import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Package,
    Boxes,
    FileText,
    CircleDollarSign,
    Percent,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

import { KPICard } from "../components/KPICard/KPICard";
import { api } from "../services/api";

interface DadoCustoPreco {
    produto: string;
    custo: number;
    preco: number;
    margem: number;
}

export const Dashboard: React.FC = () => {
    const [totalInsumos, setTotalInsumos] = useState(0);
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [totalFichas, setTotalFichas] = useState(0);
    const navigate = useNavigate();

    const [custoMedioFichas, setCustoMedioFichas] =
        useState(0);

    const [cmvMedio, setCmvMedio] = useState(0);

    const [dadosCustoPreco, setDadosCustoPreco] =
        useState<DadoCustoPreco[]>([]);

    useEffect(() => {
        async function carregarDadosDashboard() {
            try {
                // =========================
                // INSUMOS
                // =========================

                const resInsumos =
                    await api.get("/insumos");

                const insumos = Array.isArray(
                    resInsumos.data.data
                )
                    ? resInsumos.data.data
                    : [];

                setTotalInsumos(
                    insumos.length
                );

                // =========================
                // PRODUTOS
                // =========================

                const resProdutos =
                    await api.get("/produtos");

                const produtos = Array.isArray(
                    resProdutos.data.data
                )
                    ? resProdutos.data.data
                    : [];

                setTotalProdutos(
                    produtos.length
                );

                // =========================
                // FICHAS TÉCNICAS
                // =========================

                const resFichas =
                    await api.get("/fichas");

                const fichas = Array.isArray(
                    resFichas.data.data
                )
                    ? resFichas.data.data
                    : [];

                setTotalFichas(
                    fichas.length
                );

                // =========================
                // CUSTO MÉDIO DAS FICHAS
                // =========================

                const custoMedio =
                    fichas.length > 0
                        ? fichas.reduce(
                            (
                                total: number,
                                ficha: any
                            ) =>
                                total +
                                Number(
                                    ficha.custoTotal || 0
                                ),
                            0
                        ) / fichas.length
                        : 0;

                setCustoMedioFichas(
                    custoMedio
                );

                // =========================
                // CMV MÉDIO
                // =========================

                const cmvMedioCalculado =
                    fichas.length > 0
                        ? fichas.reduce(
                            (
                                total: number,
                                ficha: any
                            ) =>
                                total +
                                Number(
                                    ficha.cmv || 0
                                ),
                            0
                        ) / fichas.length
                        : 0;

                setCmvMedio(
                    cmvMedioCalculado
                );

                // =========================
                // DADOS DO GRÁFICO
                // CUSTO X PREÇO
                // =========================

                const custoPorProduto =
                    new Map<string, number>();

                fichas.forEach(
                    (ficha: any) => {
                        if (!ficha.produtoId) {
                            return;
                        }

                        custoPorProduto.set(
                            String(
                                ficha.produtoId
                            ),
                            Number(
                                ficha.custoTotal || 0
                            )
                        );
                    }
                );

                const dadosGrafico = produtos
                    .map((produto: any) => {
                        const custo =
                            custoPorProduto.get(
                                String(produto._id)
                            ) || 0;

                        const preco = Number(
                            produto.preco || 0
                        );

                        const margem = preco - custo;

                        return {
                            produto: produto.nome,
                            custo,
                            preco,
                            margem,
                        };
                    })
                    .filter(
                        (
                            item: DadoCustoPreco & {
                                margem: number;
                            }
                        ) =>
                            item.custo > 0 ||
                            item.preco > 0
                    )
                    .sort(
                        (
                            a: DadoCustoPreco,
                            b: DadoCustoPreco
                        ) => b.margem - a.margem
                    )
                    .slice(0, 10);

                setDadosCustoPreco(
                    dadosGrafico
                );
            } catch (error) {
                console.error(
                    "Erro ao carregar dados do dashboard:",
                    error
                );

                setTotalInsumos(0);
                setTotalProdutos(0);
                setTotalFichas(0);
                setCustoMedioFichas(0);
                setCmvMedio(0);
                setDadosCustoPreco([]);
            }
        }

        carregarDadosDashboard();
    }, []);

    return (
        <div className="dashboard-container">

            {/* =========================
                HEADER
            ========================= */}

            <div className="dashboard-header">

                <div className="dashboard-title">

                    <h1>
                        Olá, Admin! 👋
                    </h1>

                    <p>
                        Aqui está o resumo geral
                        da sua operação
                    </p>

                </div>

                <div className="dashboard-actions">

                    <div className="period-card">

                        <CalendarDays
                            size={18}
                        />

                        <span>
                            20/05/2025 -
                            20/06/2025
                        </span>

                    </div>

                    <div className="user-card">

                        <div className="user-avatar">
                            A
                        </div>

                        <div className="user-info">

                            <strong>
                                Admin
                            </strong>

                            <span>
                                Administrador
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* =========================
                KPIs
            ========================= */}

            <div className="dashboard-cards">

                <KPICard
                    title="Total de Insumos"
                    value={String(
                        totalInsumos
                    )}
                    change="+12%"
                    icon={Package}
                    color="#1E5CBC"
                    bg="rgba(30, 92, 188, 0.15)"
                />

                <KPICard
                    title="Total de Produtos"
                    value={String(
                        totalProdutos
                    )}
                    change="+8%"
                    icon={Boxes}
                    color="#22C55E"
                    bg="rgba(34, 197, 94, 0.15)"
                />

                <KPICard
                    title="Total de Fichas Técnicas"
                    value={String(
                        totalFichas
                    )}
                    change="+5%"
                    icon={FileText}
                    color="#F59E0B"
                    bg="rgba(245, 158, 11, 0.15)"
                />

                <KPICard
                    title="Custo Médio das Fichas"
                    value={custoMedioFichas.toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL",
                        }
                    )}
                    change="+0%"
                    icon={CircleDollarSign}
                    color="#A855F7"
                    bg="rgba(168, 85, 247, 0.15)"
                />

                <KPICard
                    title="CMV Médio"
                    value={`${cmvMedio.toFixed(
                        1
                    ).replace(".", ",")}%`}
                    change="+0%"
                    icon={Percent}
                    color="#F59E0B"
                    bg="rgba(245, 158, 11, 0.15)"
                />

            </div>

            {/* =========================
                GRÁFICO
            ========================= */}

            <div className="dashboard-main-grid">

                <section className="dashboard-panel dashboard-chart-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Top 10 Produtos — Custo x Preço
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="dashboard-view-all"
                            onClick={() => navigate("/produtos")}
                        >
                            Ver todos os produtos →
                        </button>

                    </div>

                    <div className="dashboard-chart">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            <BarChart
                                data={
                                    dadosCustoPreco
                                }
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 10,
                                }}
                            >

                                <CartesianGrid
                                    stroke="#232F4A"
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="produto"
                                    stroke="#64748B"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{
                                        fill: "#64748B",
                                        fontSize: 11,
                                    }}
                                />

                                <YAxis
                                    stroke="#64748B"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{
                                        fill: "#64748B",
                                        fontSize: 11,
                                    }}
                                    tickFormatter={(
                                        valor
                                    ) =>
                                        `R$ ${valor}`
                                    }
                                />

                                <Tooltip
                                    cursor={false}
                                    contentStyle={{
                                        background: "#0F1423",
                                        border: "1px solid #232F4A",
                                        borderRadius: "10px",
                                        color: "#FFFFFF",
                                    }}
                                    labelStyle={{
                                        color: "#FFFFFF",
                                    }}
                                    formatter={(valor, nome) => [
                                        Number(valor).toLocaleString(
                                            "pt-BR",
                                            {
                                                style: "currency",
                                                currency: "BRL",
                                            }
                                        ),
                                        nome,
                                    ]}
                                />

                                <Legend
                                    wrapperStyle={{
                                        color:
                                            "#94A3B8",
                                        fontSize:
                                            "12px",
                                        paddingTop:
                                            "10px",
                                    }}
                                />

                                <Bar
                                    dataKey="custo"
                                    name="Custo"
                                    fill="#1E5CBC"
                                    radius={[5, 5, 0, 0]}
                                />

                                <Bar
                                    dataKey="preco"
                                    name="Preço de venda"
                                    fill="#22C55E"
                                    radius={[5, 5, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </section>

            </div>

        </div>
    );
};