import { useEffect, useState } from "react";
import { api } from "../services/api";
import { formatarUnidade } from "../utils/formatarUnidade";
import "./Insumos.css";
import {
    Plus,
    Search,
    Filter,
    Layers,
    SlidersHorizontal,
    ChefHat,
    Eye,
    Pencil,
    Trash2,
    Printer,
    X,
    Save
} from "lucide-react";
import ModalTransformacao from "../components/Modals/ModalTransformacao";

export function Insumos() {
    const [insumos, setInsumos] = useState<any[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [filtroCategoria, setFiltroCategoria] = useState("todas");
    const [pesquisasIngredientes, setPesquisasIngredientes] = useState<{ [key: number]: string }>({});
    const [inputAberto, setInputAberto] = useState<number | null>(null);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [dadosEditados, setDadosEditados] = useState<any>({ nome: "", rendimento: 0, valorTotal: 0, ingredientes: [] });
    const [categoriaProduto, setCategoriaProduto] = useState("");

    const [modalAberto, setModalAberto] = useState(false);
    const [insumoSelecionado, setInsumoSelecionado] = useState<any>(null);
    const [precoVenda, setPrecoVenda] = useState<number | "">(0);
    const [etapaCadastro, setEtapaCadastro] = useState(1);
    const [tipoCadastro, setTipoCadastro] = useState<
        "insumo" | "insumo-produto" | ""
    >("");
    const [modalTransformacao, setModalTransformacao] = useState(false);

    const insumosFiltrados = insumos.filter((insumo) => {
        const matchPesquisa =
            insumo.nome
                ?.toLowerCase()
                .includes(pesquisa.toLowerCase());

        const matchTipo =
            filtroTipo === "todos"
                ? true
                : insumo.tipo === filtroTipo;

        const matchCategoria =
            filtroCategoria === "todas"
                ? true
                : insumo.categoria === filtroCategoria;

        return matchPesquisa && matchTipo && matchCategoria;
    });

    // Obter lista única de categorias
    const categorias = Array.from(
        new Set(insumos.map((insumo) => insumo.categoria).filter(Boolean))
    );

    // Dynamic stats trackers
    const totalInsumosCount = insumos.length;
    const baseInsumosCount = insumos.filter(i => !i.tipo || i.tipo === "base").length;
    const transformadosCount = insumos.filter(i => i.tipo === "transformado").length;
    const categoriasCount = categorias.length;

    async function carregarInsumos() {
        try {
            const res = await api.get("/insumos");



            setInsumos(
                Array.isArray(res.data.data)
                    ? res.data.data
                    : []
            );

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        carregarInsumos();
    }, []);

    useEffect(() => {
        const fecharPesquisa = () => {
            setInputAberto(null);
        };
        document.addEventListener("click", fecharPesquisa);

        return () => {
            document.removeEventListener("click", fecharPesquisa);
        };
    }, []);

    function abrirModal(insumo: any) {
        setModoEdicao(false);
        setInsumoSelecionado(insumo);

        setDadosEditados({
            nome: insumo.nome,
            categoria: insumo.categoria,
            unidade: insumo.unidade,

            qtdBruta: insumo.qtdBruta,

            qtdLiquida: insumo.qtdLiquida,

            valorTotal: insumo.valorTotal,
            rendimento: insumo.rendimento,

            ingredientes: insumo.transformacao?.ingredientes
                ? JSON.parse(JSON.stringify(insumo.transformacao.ingredientes))
                : [],
        });

        setModalAberto(true);
    }

    function handleCriarNovoInsumo() {
        setInsumoSelecionado(null);

        setEtapaCadastro(1);

        setTipoCadastro("");

        setModoEdicao(false);

        setDadosEditados({
            nome: "",
            categoria: "",
            unidade: "",
            qtdBruta: 0,
            qtdLiquida: 0,
            valorTotal: 0,
            rendimento: 0,
            ingredientes: []
        });
        setModalAberto(true);
    }

    function imprimirFicha() {
        window.print();
    }

    async function deletarInsumo(id: string) {
        const confirmar = window.confirm(
            "Tem certeza que deseja deletar este insumo?"
        );

        if (!confirmar) return;

        try {
            await api.delete(`/insumos/${id}`);
            setModalAberto(false);
            await carregarInsumos();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="insumos-container">
            <div className="insumos-card">

                {/* 1. HEADER BANNER */}
                <div className="insumos-header-banner" id="insumos-header-banner">
                    <div className="insumos-header-icon-wrapper">
                        <Layers className="insumos-header-icon" />
                    </div>
                    <h1 className="insumos-header-title">TELA DE INSUMOS</h1>
                </div>

                {/* 2. MAIN CONTENT BODY */}
                <div className="insumos-content">

                    {/* Introductory subtitle and action bar */}
                    <div className="insumos-intro-row">
                        <div>
                            <p className="insumos-subtitle">
                                Gerencie todos os insumos cadastrados com cálculo em tempo real.
                            </p>
                        </div>

                        <div className="insumos-actions">
                            <button
                                onClick={handleCriarNovoInsumo}
                                className="insumos-create-btn"
                            >
                                <Plus className="w-4.5 h-4.5" />
                                Criar Insumo
                            </button>

                            <button
                                onClick={() => setModalTransformacao(true)}
                                className="insumos-transformacao-btn"
                            >
                                🔄 Criar Transformação
                            </button>
                        </div>
                    </div>

                    {/* STATS MODULE PANEL */}
                    <div className="insumos-stats-grid">
                        <div className="insumos-stat-card">
                            <div>
                                <span className="insumos-stat-label">Total Insumos</span>
                                <span className="insumos-stat-value">{totalInsumosCount}</span>
                            </div>
                            <div className="insumos-stat-icon-container blue">
                                <Layers className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="insumos-stat-card">
                            <div>
                                <span className="insumos-stat-label">Insumos Base</span>
                                <span className="insumos-stat-value accent-blue">{baseInsumosCount}</span>
                            </div>
                            <div className="insumos-stat-icon-container slate">
                                <SlidersHorizontal className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="insumos-stat-card">
                            <div>
                                <span className="insumos-stat-label">Transformados</span>
                                <span className="insumos-stat-value">{transformadosCount}</span>
                            </div>
                            <div className="insumos-stat-icon-container amber">
                                <ChefHat className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="insumos-stat-card">
                            <div>
                                <span className="insumos-stat-label">Categorias</span>
                                <span className="insumos-stat-value accent-emerald">{categoriasCount}</span>
                            </div>
                            <div className="insumos-stat-icon-container emerald">
                                <Filter className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* SEARCHBAR AND DROPDOWN FILTERS */}
                    <div className="insumos-controls-row">
                        <div className="insumos-search-wrapper">
                            <Search className="insumos-search-icon" />
                            <input
                                placeholder="Barra de pesquisa"
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                                className="insumos-search-input"
                            />
                        </div>

                        <div className="insumos-select-wrapper">
                            <Filter className="insumos-select-icon" />
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                className="insumos-select"
                            >
                                <option value="todos">Todos os Tipos</option>
                                <option value="base">Base</option>
                                <option value="transformado">Transformado</option>
                            </select>
                            <span className="insumos-select-arrow">▼</span>
                        </div>

                        <div className="insumos-select-wrapper">
                            <Filter className="insumos-select-icon" />
                            <select
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                                className="insumos-select"
                            >
                                <option value="todas">Filtro por categoria</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria} value={categoria}>
                                        {categoria}
                                    </option>
                                ))}
                            </select>
                            <span className="insumos-select-arrow">▼</span>
                        </div>
                    </div>

                    {/* MULTI-COLUMN COMPACT TABLE */}
                    <div className="insumos-table-wrapper">
                        <div className="insumos-table-scroll">
                            <table className="insumos-table">
                                <thead>
                                    <tr>
                                        <th>Insumo</th>
                                        <th>Tipo</th>
                                        <th>Categoria</th>
                                        <th>Fornecedor</th>
                                        <th>Rendimento</th>
                                        <th>Fichas</th>
                                        <th>Unidade</th>
                                        <th>Valor Unitário</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {insumosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} style={{ textAlign: "center", color: "#64748b" }}>
                                                Nenhum insumo encontrado para este filtro de busca.
                                            </td>
                                        </tr>
                                    ) : (
                                        insumosFiltrados.map((insumo) => (
                                            <tr key={insumo._id}>

                                                {/* Nome */}
                                                <td>{insumo.nome}</td>

                                                {/* Tipo (Base / Transformado) */}
                                                <td>
                                                    <span className={`insumo-badge ${insumo.tipo === "transformado" ? "transformado" : "base"}`}>
                                                        {insumo.tipo || "base"}
                                                    </span>
                                                </td>

                                                {/* Categoria */}
                                                <td>
                                                    <span className="insumo-category-label">
                                                        {insumo.categoria}
                                                    </span>
                                                </td>

                                                {/* Fornecedor */}
                                                <td>{insumo.fornecedor || "-"}</td>

                                                {/* Rendimento */}
                                                <td style={{ fontFamily: "monospace" }}>
                                                    {Number(insumo.rendimentoPercentual || 0).toFixed(0)}%
                                                </td>

                                                {/* Fichas */}
                                                <td style={{ fontFamily: "monospace", color: "#64748b" }}>
                                                    {insumo.fichas || 0}
                                                </td>

                                                {/* Unidade */}
                                                <td>{formatarUnidade(insumo.unidade)}</td>

                                                {/* Valor Unitário */}
                                                <td style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                                                    R$ {Number(insumo.valorUnitario)
                                                        .toFixed(2)
                                                        .replace(".", ",")}
                                                </td>

                                                {/* Compact Action Controls */}
                                                <td>
                                                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                                        <button
                                                            onClick={() => abrirModal(insumo)}
                                                            className="insumo-action-btn view"
                                                            title="Ver Detalhes"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {insumo.tipo === "transformado" && (
                                                            <button
                                                                onClick={() => {
                                                                    abrirModal(insumo);
                                                                    setModoEdicao(true);
                                                                }}
                                                                className="insumo-action-btn edit"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deletarInsumo(insumo._id)}
                                                            className="insumo-action-btn delete"
                                                            title="Deletar Insumo"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Integration dynamic status description footer */}
                        <div className="insumos-footer-row">
                            <span>Exibindo {insumosFiltrados.length} de {insumos.length} registros ativos.</span>
                            <div className="insumos-footer-status">
                                <div className="insumos-footer-dot"></div>
                                Banco de insumos integrado às receitas SR de forma automatizada
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* HIGH FIDELITY TECHNICAL SHEET DETAIL MODAL */}
            {modalAberto && (
                <div className="insumos-modal-backdrop">
                    <div className="insumos-modal-card">
                        <div className="insumos-modal-accent-top"></div>
                        <button
                            className="insumos-modal-close-btn no-print"
                            onClick={() => {
                                setModoEdicao(false);
                                setModalAberto(false);
                            }}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="insumos-modal-body" id="area-impressao">

                            {/* Modal Badge Tag */}
                            <div>
                                {insumoSelecionado && (
                                    <span className="modal-header-tag print-hide">
                                        Ficha Técnica
                                    </span>
                                )}

                                <h2 className="modal-header-title">
                                    {!insumoSelecionado ? (
                                        "Cadastrar Insumo"
                                    ) : modoEdicao ? (
                                        <input
                                            value={dadosEditados.nome}
                                            onChange={(e) =>
                                                setDadosEditados({
                                                    ...dadosEditados,
                                                    nome: e.target.value,
                                                })
                                            }
                                            className="modal-form-input"
                                            style={{ fontSize: "22px", fontWeight: "bold" }}
                                        />
                                    ) : (
                                        insumoSelecionado?.nome
                                    )}
                                </h2>

                                <p className="modal-header-subtitle no-print">
                                    {insumoSelecionado
                                        ? "Visualização completa dos componentes e rendimento"
                                        : etapaCadastro === 2
                                            ? "Configure o produto para venda"
                                            : "Informe os dados do insumo base"}
                                </p>

                                {!insumoSelecionado && etapaCadastro === 2 && (
                                    <div className="modal-divider"></div>
                                )}

                                {!insumoSelecionado && etapaCadastro === 1 && (
                                    <div className="cadastro-insumo-etapa">

                                        <div className="cadastro-card">

                                            <h3 className="cadastro-section-title">
                                                Informações básicas
                                            </h3>

                                            <div className="cadastro-grid-2">
                                                <div className="modal-form-group">
                                                    <label>Nome do insumo</label>
                                                    <input
                                                        type="text"
                                                        value={dadosEditados.nome}
                                                        onChange={(e) =>
                                                            setDadosEditados({
                                                                ...dadosEditados,
                                                                nome: e.target.value
                                                            })
                                                        }
                                                        className="modal-form-input"
                                                        placeholder="Ex: Coca-Cola Lata 350ml"
                                                    />
                                                </div>

                                                <div className="modal-form-group">
                                                    <label>Unidade de medida</label>
                                                    <select
                                                        value={dadosEditados.unidade}
                                                        onChange={(e) =>
                                                            setDadosEditados({
                                                                ...dadosEditados,
                                                                unidade: e.target.value
                                                            })
                                                        }
                                                        className="modal-form-input"
                                                    >
                                                        <option value="">Selecione</option>
                                                        <option value="kg">kg</option>
                                                        <option value="g">g</option>
                                                        <option value="l">l</option>
                                                        <option value="ml">ml</option>
                                                        <option value="un">un</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: "grid",
                                                gap: "16px",
                                                marginTop: "24px"
                                            }}>
                                                <div className="cadastro-grid-3">
                                                    <div className="modal-form-group">
                                                        <label>Quantidade Bruta</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={dadosEditados.qtdBruta}
                                                            onChange={(e) =>
                                                                setDadosEditados({
                                                                    ...dadosEditados,
                                                                    qtdBruta: e.target.value === ""
                                                                        ? ""
                                                                        : Number(e.target.value)
                                                                })
                                                            }
                                                            className="modal-form-input"
                                                        />
                                                    </div>

                                                    <div className="modal-form-group">
                                                        <label>Quantidade Líquida</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={dadosEditados.qtdLiquida}
                                                            onChange={(e) =>
                                                                setDadosEditados({
                                                                    ...dadosEditados,
                                                                    qtdLiquida: e.target.value === ""
                                                                        ? ""
                                                                        : Number(e.target.value)
                                                                })
                                                            }
                                                            className="modal-form-input"
                                                        />
                                                    </div>


                                                    <div className="modal-form-group">
                                                        <label>Valor de compra (R$)</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={dadosEditados.valorTotal}
                                                            onChange={(e) =>
                                                                setDadosEditados({
                                                                    ...dadosEditados,
                                                                    valorTotal: e.target.value === ""
                                                                        ? ""
                                                                        : Number(e.target.value)
                                                                })
                                                            }
                                                            className="modal-form-input"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h3
                                            className="resultado-section-title"
                                            style={{ marginTop: "6px", marginBottom: "6px" }}
                                        >
                                            Resultados em tempo real
                                        </h3>

                                        <div className="resultado-grid">

                                            <div className="resultado-card">
                                                <span className="resultado-label">
                                                    Rendimento
                                                </span>

                                                <h2 className="resultado-valor sucesso">
                                                    {dadosEditados.qtdBruta > 0
                                                        ? (
                                                            (dadosEditados.qtdLiquida /
                                                                dadosEditados.qtdBruta) *
                                                            100
                                                        ).toFixed(0)
                                                        : 0}
                                                    %
                                                </h2>

                                                <p className="resultado-info">
                                                    {dadosEditados.qtdLiquida || 0}
                                                    {" "}
                                                    {dadosEditados.unidade || "un"}
                                                    {" de "}
                                                    {dadosEditados.qtdBruta || 0}
                                                    {" "}
                                                    {dadosEditados.unidade || "un"}
                                                </p>
                                            </div>

                                            <div className="resultado-card">
                                                <span className="resultado-label">
                                                    Valor Unitário
                                                </span>

                                                <h2 className="resultado-valor sucesso">
                                                    R$
                                                    {" "}
                                                    {dadosEditados.qtdLiquida > 0
                                                        ? (
                                                            dadosEditados.valorTotal /
                                                            dadosEditados.qtdLiquida
                                                        ).toFixed(2)
                                                        : "0.00"}

                                                    <span className="resultado-unidade">
                                                        {" / "}
                                                        {dadosEditados.unidade || "un"}
                                                    </span>
                                                </h2>

                                                <p className="resultado-info">
                                                    Custo por unidade líquida
                                                </p>
                                            </div>

                                        </div>

                                    </div>
                                )}

                                {!insumoSelecionado && etapaCadastro === 2 && (

                                    <div className="cadastro-produto-etapa">



                                        <h3 className="cadastro-section-title">
                                            Informações básicas
                                        </h3>

                                        <div className="modal-form-group">
                                            <div className="insumo-base-preview">
                                                <span>{dadosEditados.nome}</span>

                                                <span className="badge-insumo-base">
                                                    Insumo base
                                                </span>
                                            </div>
                                        </div>

                                        <div className="modal-divider"></div>

                                        <h3 className="cadastro-section-title">
                                            Dados do produto
                                        </h3>

                                        <div className="dados-produto-section">

                                            <label>Categoria do produto</label>

                                            <input
                                                type="text"
                                                placeholder="Ex: Bebidas"
                                                value={categoriaProduto}
                                                onChange={(e) =>
                                                    setCategoriaProduto(e.target.value)
                                                }
                                                className="modal-form-input"
                                            />

                                            {tipoCadastro === "insumo-produto" && (
                                                <>
                                                    <label style={{ marginTop: "16px" }}>
                                                        Preço de venda (R$)
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={precoVenda}
                                                        onChange={(e) =>
                                                            setPrecoVenda(
                                                                e.target.value === ""
                                                                    ? ""
                                                                    : Number(e.target.value)
                                                            )
                                                        }
                                                        className="modal-form-input"
                                                    />
                                                </>
                                            )}

                                        </div>

                                        <h3
                                            className="resultado-section-title"
                                            style={{ marginTop: "28px", marginBottom: "16px" }}
                                        >
                                            Indicadores em tempo real
                                        </h3>

                                        <div className="resultado-grid-produto">

                                            <div className="resultado-card">
                                                <span className="resultado-label">
                                                    Custo unitário
                                                </span>

                                                <h2 className="resultado-valor sucesso">
                                                    R$ {
                                                        dadosEditados.qtdLiquida > 0
                                                            ? (
                                                                dadosEditados.valorTotal /
                                                                dadosEditados.qtdLiquida
                                                            ).toFixed(2)
                                                            : "0,00"
                                                    }
                                                </h2>

                                                <p className="resultado-info">
                                                    Custo por unidade
                                                </p>
                                            </div>

                                            <div className="resultado-card">
                                                <span className="resultado-label">
                                                    CMV (%)
                                                </span>

                                                <h2 className="resultado-valor alerta">
                                                    {
                                                        Number(precoVenda) > 0
                                                            ? (
                                                                (
                                                                    (dadosEditados.qtdLiquida > 0
                                                                        ? dadosEditados.valorTotal / dadosEditados.qtdLiquida
                                                                        : 0
                                                                    ) / Number(precoVenda)
                                                                ) * 100
                                                            ).toFixed(0)
                                                            : 0
                                                    }%
                                                </h2>

                                                <p className="resultado-info">
                                                    Custo sobre venda
                                                </p>
                                            </div>

                                            <div className="resultado-card">
                                                <span className="resultado-label">
                                                    Margem de contribuição
                                                </span>

                                                <h2 className="resultado-valor sucesso">
                                                    R$ {
                                                        (
                                                            Number(precoVenda) -
                                                            (
                                                                dadosEditados.qtdLiquida > 0
                                                                    ? dadosEditados.valorTotal /
                                                                    dadosEditados.qtdLiquida
                                                                    : 0
                                                            )
                                                        ).toFixed(2)
                                                    }
                                                </h2>

                                                <p className="resultado-info">
                                                    Valor por unidade
                                                </p>
                                            </div>

                                        </div>

                                        <div className="cadastro-resumo-produto">

                                            <h4>Ao salvar serão criados:</h4>

                                            <div className="cadastro-resumo-item">
                                                • 1 insumo base: {dadosEditados.nome || "-"}
                                            </div>

                                            <div className="cadastro-resumo-item">
                                                • 1 produto para venda: {dadosEditados.nome || "-"}
                                            </div>

                                        </div>

                                    </div>

                                )}
                            </div>

                            {insumoSelecionado && (
                                <div className="modal-info-panel-row">
                                    <div>
                                        <p className="modal-info-block-label">Rendimento</p>
                                        <span className="modal-info-block-value">
                                            {dadosEditados.qtdLiquida > 0
                                                ? `${dadosEditados.qtdLiquida} ${dadosEditados.unidade}`
                                                : "0"}
                                        </span>
                                    </div>

                                    <div style={{ textAlign: "right" }}>
                                        <p className="modal-info-block-label">Custo Estimado</p>
                                        <span className="modal-info-block-cost">
                                            R$ {Number(modoEdicao ? dadosEditados.valorTotal : dadosEditados.valorTotal || insumoSelecionado?.valorTotal || 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* TIPO DE CADASTRO */}
                            {!insumoSelecionado && etapaCadastro === 1 && (
                                <div className="cadastro-tipo">
                                    <h4>Tipo de cadastro</h4>

                                    <label>
                                        <input
                                            type="radio"
                                            value="insumo"
                                            checked={tipoCadastro === "insumo"}
                                            onChange={() => setTipoCadastro("insumo")}
                                        />

                                        <div>
                                            <div className="cadastro-opcao-titulo">
                                                Criar apenas o insumo base
                                            </div>

                                            <div className="cadastro-opcao-descricao">
                                                Será criado somente o insumo base no estoque
                                            </div>
                                        </div>
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            value="insumo-produto"
                                            checked={tipoCadastro === "insumo-produto"}
                                            onChange={() => setTipoCadastro("insumo-produto")}
                                        />

                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px"
                                                }}
                                            >
                                                <div className="cadastro-opcao-titulo">
                                                    Criar insumo base + produto para venda
                                                </div>

                                                <span className="cadastro-badge-recomendado">
                                                    Recomendado
                                                </span>
                                            </div>

                                            <div className="cadastro-opcao-descricao">
                                                Será criado o insumo base e já um produto para venda
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            )}

                            {/* SUB-INGREDIENT DISH COMPOSITION */}
                            {(modoEdicao ||
                                insumoSelecionado?.transformacao?.ingredientes?.length > 0) && (
                                    <div className="modal-ingredients-section">
                                        {/* Cabeçalho */}
                                        <div
                                            className={
                                                modoEdicao
                                                    ? "modal-ingredients-header-edicao"
                                                    : "modal-ingredients-header"
                                            }
                                        >
                                            <span>Ingrediente</span>
                                            <span style={{ textAlign: "center" }}>Quantidade</span>
                                            <span style={{ textAlign: "center" }}>Unidade</span>
                                            <span style={{ textAlign: "center" }}>Custo</span>
                                            {modoEdicao && (
                                                <span style={{ textAlign: "center" }}>
                                                    Ação
                                                </span>
                                            )}
                                        </div>
                                        {/* Área com scroll */}
                                        <div className="modal-ingredients-scroll">
                                            {(modoEdicao ? dadosEditados.ingredientes : insumoSelecionado?.transformacao?.ingredientes)?.map((ingrediente: any, index: number) => {
                                                const ingredienteCompleto =
                                                    insumos.find(
                                                        (i: any) =>
                                                            String(i._id) === String(ingrediente.insumo)
                                                    ) || ingrediente;

                                                const insumosPesquisa = insumos.filter((ins: any) =>
                                                    ins.nome?.toLowerCase().includes(
                                                        (pesquisasIngredientes[index] || "").toLowerCase()
                                                    )
                                                );
                                                const custoIngrediente = (Number(ingredienteCompleto?.valorUnitario || 0) * Number(ingrediente.qtdLiquida || 0)).toFixed(2);

                                                return (
                                                    <div
                                                        key={`${ingrediente.insumo}-${index}`}
                                                        className={modoEdicao ? "modal-ingredient-row-edicao" : "modal-ingredient-row"}
                                                    >
                                                        {/* Ingrediente */}
                                                        {ingrediente.pesquisando ? (
                                                            <div
                                                                style={{
                                                                    position: "relative",
                                                                    width: "100%"
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setInputAberto(index);
                                                                }}
                                                            >
                                                                <input
                                                                    type="text"
                                                                    placeholder="🔍 Pesquisar ingrediente..."
                                                                    value={pesquisasIngredientes[index] || ""}
                                                                    onFocus={() => setInputAberto(index)}
                                                                    onChange={(e) =>
                                                                        setPesquisasIngredientes({
                                                                            ...pesquisasIngredientes,
                                                                            [index]: e.target.value
                                                                        })
                                                                    }
                                                                    className="modal-form-input"
                                                                />

                                                                {inputAberto === index &&
                                                                    (pesquisasIngredientes[index] || "") && (
                                                                        <div
                                                                            style={{
                                                                                position: "absolute",
                                                                                top: "100%",
                                                                                left: 0,
                                                                                right: 0,
                                                                                background: "#111827",
                                                                                border: "1px solid #374151",
                                                                                borderRadius: "8px",
                                                                                maxHeight: "200px",
                                                                                overflowY: "auto",
                                                                                zIndex: 99999,
                                                                                boxShadow: "0 10px 25px rgba(0,0,0,.5)"
                                                                            }}
                                                                        >
                                                                            {insumosPesquisa.slice(0, 10).map((ins: any) => (
                                                                                <div
                                                                                    key={ins._id}
                                                                                    style={{
                                                                                        padding: "10px",
                                                                                        cursor: "pointer",
                                                                                        borderBottom: "1px solid #1f2937"
                                                                                    }}
                                                                                    onClick={() => {
                                                                                        const novosIngredientes =
                                                                                            dadosEditados.ingredientes.map(
                                                                                                (item: any, idx: number) =>
                                                                                                    idx === index
                                                                                                        ? {
                                                                                                            ...item,
                                                                                                            insumo: ins._id,
                                                                                                            pesquisando: false
                                                                                                        }
                                                                                                        : item
                                                                                            );

                                                                                        setDadosEditados({
                                                                                            ...dadosEditados,
                                                                                            ingredientes: novosIngredientes
                                                                                        });

                                                                                        setPesquisasIngredientes({
                                                                                            ...pesquisasIngredientes,
                                                                                            [index]: ""
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    {ins.nome}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                            </div>

                                                        ) : (

                                                            <span style={{ color: "#ffffff", fontWeight: 600 }}>
                                                                {ingredienteCompleto?.nome || "SEM NOME"}
                                                            </span>
                                                        )}
                                                        {/* Quantidade */}
                                                        <div style={{ textAlign: "center" }}>
                                                            {modoEdicao ? (
                                                                <input
                                                                    type="number"
                                                                    value={ingrediente.qtdLiquida || ""}
                                                                    onChange={(e) => {
                                                                        const novosIngredientes =
                                                                            dadosEditados.ingredientes.map(
                                                                                (item: any, idx: number) =>
                                                                                    idx === index
                                                                                        ? {
                                                                                            ...item,
                                                                                            qtdLiquida: Number(e.target.value)
                                                                                        }
                                                                                        : item
                                                                            );

                                                                        setDadosEditados({
                                                                            ...dadosEditados,
                                                                            ingredientes: novosIngredientes,
                                                                        });
                                                                    }}
                                                                    className="modal-form-input"
                                                                    style={{ textAlign: "center", width: "80px" }}
                                                                />
                                                            ) : (
                                                                <span>{ingrediente.qtdLiquida}</span>
                                                            )}
                                                        </div>

                                                        {/* Unidade */}
                                                        <span style={{ textAlign: "center" }}>{formatarUnidade(ingredienteCompleto?.unidade)}</span>

                                                        {/* Custo */}
                                                        <span style={{ textAlign: "center", color: "#10b981", fontWeight: "bold" }}>
                                                            R$ {custoIngrediente}
                                                        </span>


                                                        {/* Deletar item */}
                                                        {modoEdicao && (
                                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                                <button
                                                                    onClick={() => {
                                                                        const novosIngredientes = dadosEditados.ingredientes.filter((_: any, idx: number) => idx !== index);
                                                                        setDadosEditados({ ...dadosEditados, ingredientes: novosIngredientes });
                                                                    }}
                                                                    className="insumo-action-btn delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}

                                                    </div>

                                                );

                                            })
                                            }
                                        </div>

                                        {modoEdicao && (
                                            <div style={{ padding: "12px", display: "flex", justifyContent: "center" }}>
                                                <button
                                                    onClick={() => {
                                                        setDadosEditados({
                                                            ...dadosEditados,
                                                            ingredientes: [
                                                                ...dadosEditados.ingredientes,
                                                                {
                                                                    insumo: "",
                                                                    qtdLiquida: 0,
                                                                    pesquisando: true
                                                                }
                                                            ]
                                                        });
                                                    }}
                                                    className="modal-add-ingredient-btn"
                                                    style={{ fontSize: "11px", padding: "6px 12px" }}
                                                >
                                                    + Adicionar Ingrediente
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="modal-divider"></div>

                            {!insumoSelecionado && etapaCadastro === 1 ? (

                                <div className="modal-footer no-print">

                                    <button
                                        className="modal-footer-btn delete"
                                        onClick={() => setModalAberto(false)}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        className="modal-footer-btn save"
                                        onClick={() => {

                                            if (!dadosEditados.nome?.trim()) {
                                                alert("Informe o nome do insumo");
                                                return;
                                            }

                                            if (!dadosEditados.unidade) {
                                                alert("Selecione a unidade de medida");
                                                return;
                                            }

                                            if (!dadosEditados.qtdBruta || Number(dadosEditados.qtdBruta) <= 0) {
                                                alert("Informe a quantidade bruta");
                                                return;
                                            }

                                            if (!dadosEditados.qtdLiquida || Number(dadosEditados.qtdLiquida) <= 0) {
                                                alert("Informe a quantidade líquida");
                                                return;
                                            }

                                            if (!dadosEditados.valorTotal || Number(dadosEditados.valorTotal) <= 0) {
                                                alert("Informe o valor de compra");
                                                return;
                                            }

                                            if (!tipoCadastro) {
                                                alert("Selecione o tipo de cadastro");
                                                return;
                                            }

                                            setEtapaCadastro(2);
                                        }}
                                    >
                                        Próximo
                                    </button>

                                </div>

                            ) : !insumoSelecionado && etapaCadastro === 2 ? (

                                <div className="modal-footer no-print">

                                    <button
                                        className="modal-footer-btn delete"
                                        onClick={() => setEtapaCadastro(1)}
                                    >
                                        Voltar
                                    </button>

                                    <button
                                        className="modal-footer-btn save"
                                        onClick={async () => {

                                            if (tipoCadastro === "insumo-produto") {

                                                if (!categoriaProduto?.trim()) {
                                                    alert("Informe a categoria do produto");
                                                    return;
                                                }

                                                if (!precoVenda || Number(precoVenda) <= 0) {
                                                    alert("Informe o preço de venda");
                                                    return;
                                                }
                                            }

                                            try {
                                                await api.post("/insumos/com-ficha", {
                                                    nome: dadosEditados.nome,
                                                    categoria: categoriaProduto,
                                                    unidade: dadosEditados.unidade,
                                                    qtdBruta: Number(dadosEditados.qtdBruta),
                                                    qtdLiquida: Number(dadosEditados.qtdLiquida),
                                                    valorTotal: Number(dadosEditados.valorTotal),
                                                    precoVenda: Number(precoVenda),
                                                });

                                                alert("Produto criado com sucesso!");

                                                await carregarInsumos();
                                                setModalAberto(false);
                                                setEtapaCadastro(1);

                                            } catch (error: any) {
                                                console.error(error);

                                                alert(
                                                    error.response?.data?.message ||
                                                    "Erro ao criar produto"
                                                );
                                            }
                                        }}
                                    >
                                        Salvar
                                    </button>

                                </div>

                            ) : (

                                <div className="modal-footer no-print">

                                    <div className="modal-btn-group-left">
                                        <button
                                            onClick={imprimirFicha}
                                            className="modal-footer-btn print"
                                        >
                                            <Printer className="w-4 h-4" /> Imprimir
                                        </button>

                                        {insumoSelecionado && (
                                            <button
                                                onClick={() => deletarInsumo(insumoSelecionado._id)}
                                                className="modal-footer-btn delete"
                                            >
                                                <Trash2 className="w-4 h-4" /> Deletar
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <button
                                            onClick={async () => {
                                                if (!modoEdicao) {
                                                    setModoEdicao(true);
                                                    return;
                                                }
                                                const custoTotal = dadosEditados.ingredientes.reduce(
                                                    (total: number, item: any) => {
                                                        const insumo = insumos.find(i => i._id === item.insumo);

                                                        if (!insumo) return total;

                                                        const valorUnitario = Number(insumo.valorUnitario || 0);
                                                        const quantidade = Number(item.qtdLiquida || 0);

                                                        return total + valorUnitario * quantidade;
                                                    },
                                                    0
                                                );

                                                try {
                                                    if (insumoSelecionado) {
                                                        const linhaIncompleta = (dadosEditados.ingredientes || []).find(
                                                            (item: any) =>
                                                                !item.insumo ||
                                                                !item.qtdLiquida ||
                                                                Number(item.qtdLiquida) <= 0
                                                        );

                                                        if (linhaIncompleta) {
                                                            alert(
                                                                "Existem ingredientes sem seleção ou sem quantidade."
                                                            );
                                                            return;
                                                        }

                                                        const ingredientesLimpos: {
                                                            insumo: string;
                                                            qtdLiquida: number;
                                                        }[] = (dadosEditados.ingredientes || [])
                                                            .filter((i: any) => i.insumo)
                                                            .map((item: any) => ({
                                                                insumo: item.insumo,
                                                                qtdLiquida: Number(item.qtdLiquida) || 0,
                                                            }));

                                                        // 🚨 VALIDAÇÃO
                                                        const ingredienteSemQuantidade = ingredientesLimpos.find(
                                                            (item: any) => item.qtdLiquida <= 0
                                                        );

                                                        if (ingredienteSemQuantidade) {
                                                            alert(
                                                                "Todos os ingredientes precisam ter uma quantidade maior que zero."
                                                            );
                                                            return;
                                                        }

                                                        const payload = {
                                                            nome: dadosEditados.nome,
                                                            categoria: dadosEditados.categoria,
                                                            unidade: dadosEditados.unidade,

                                                            qtdBruta: Number(dadosEditados.qtdBruta) || 0,
                                                            qtdLiquida: Number(dadosEditados.qtdLiquida) || 0,
                                                            valorTotal: Number(custoTotal) || 0,

                                                            transformacao: {
                                                                ingredientes: ingredientesLimpos,
                                                            },
                                                        };
                                                        await api.put(
                                                            `/insumos/${insumoSelecionado._id}`,
                                                            payload
                                                        );

                                                        alert("Insumo atualizado com sucesso!");
                                                    } else {

                                                        const ingredientesLimpos = (dadosEditados.ingredientes || [])
                                                            .filter(
                                                                (i: any) =>
                                                                    i.insumo &&
                                                                    Number(i.qtdLiquida) > 0
                                                            )
                                                            .map((item: any) => ({
                                                                insumo: item.insumo,
                                                                qtdLiquida: Number(item.qtdLiquida),
                                                            }));

                                                        // 🚨 VALIDAÇÃO
                                                        const ingredienteSemQuantidade = ingredientesLimpos.find(
                                                            (item: any) => item.qtdLiquida <= 0
                                                        );

                                                        if (ingredienteSemQuantidade) {
                                                            alert(
                                                                "Todos os ingredientes precisam ter uma quantidade maior que zero."
                                                            );
                                                            return;
                                                        }

                                                        await api.post(`/insumos`, {
                                                            nome: dadosEditados.nome,
                                                            categoria: dadosEditados.categoria,
                                                            unidade: dadosEditados.unidade,

                                                            qtdBruta: Number(dadosEditados.qtdBruta) || 0,
                                                            qtdLiquida: Number(dadosEditados.qtdLiquida) || 0,
                                                            valorTotal: Number(custoTotal) || 0,

                                                            transformacao: {
                                                                ingredientes: ingredientesLimpos,
                                                            },
                                                        });

                                                        alert("Insumo criado com sucesso!");
                                                    }

                                                    await carregarInsumos();
                                                    setModoEdicao(false);
                                                    setModalAberto(false);

                                                } catch (error: any) {
                                                    console.error(error);

                                                    alert(
                                                        "Erro ao salvar insumo: " +
                                                        (error.response?.data?.message || error.message)
                                                    );
                                                }
                                            }} className="modal-footer-btn save"
                                        >
                                            <Save className="w-4 h-4" />
                                            {modoEdicao ? "Salvar" : "Editar"}
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )
            }
            <ModalTransformacao
                open={modalTransformacao}
                onClose={() => setModalTransformacao(false)}
            />
        </div >
    );
}