import { useEffect, useState } from "react";
import { formatarQuantidade } from "../utils/formatarQuantidade";
import { api } from "../services/api";
import { formatarUnidade } from "../utils/formatarUnidade";
import "./insumos.css";
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

export function Insumos() {
    const [insumos, setInsumos] = useState<any[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [filtroCategoria, setFiltroCategoria] = useState("todas");
    const [pesquisaIngrediente, setPesquisaIngrediente] = useState("");


    const [modoEdicao, setModoEdicao] = useState(false);
    const [dadosEditados, setDadosEditados] = useState<any>({ nome: "", rendimento: 0, valorTotal: 0, ingredientes: [] });

    const [modalAberto, setModalAberto] = useState(false);
    const [insumoSelecionado, setInsumoSelecionado] = useState<any>(null);

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

    const insumosPesquisa = insumos.filter((ins: any) =>
        ins.nome
            ?.toLowerCase()
            .includes(pesquisaIngrediente.toLowerCase())
    );

    // Dynamic stats trackers
    const totalInsumosCount = insumos.length;
    const baseInsumosCount = insumos.filter(i => !i.tipo || i.tipo === "base").length;
    const transformadosCount = insumos.filter(i => i.tipo === "transformado").length;
    const categoriasCount = categorias.length;

    async function carregarInsumos() {
        try {
            const res = await api.get("/insumos");
            console.log(res.data.data);

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

    function abrirModal(insumo: any) {

        console.log("INSUMO COMPLETO:", insumo);
        console.log("TRANSFORMAÇÃO:", insumo.transformacao);
        console.log("INGREDIENTES:", insumo.transformacao?.ingredientes);
        console.log("INSUMO ABERTO:", insumo);

        setModoEdicao(false);
        setInsumoSelecionado(insumo);
        console.log("INSUMO ABERTO:", insumo);
        console.log("TRANSFORMAÇÃO:", insumo.transformacao);
        console.log("INGREDIENTES:", insumo.transformacao?.ingredientes);

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

    // Direct helper for adding a completely new raw/complex insumo
    function handleCriarNovoInsumo() {
        setInsumoSelecionado(null);
        setModoEdicao(true);
        setDadosEditados({
            nome: "",
            categoria: "Ingredientes Base",
            unidade: "kg",
            qtdBruta: 1,
            qtdLiquida: 1,
            valorTotal: 0,
            rendimento: 100,
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
                        <button
                            onClick={handleCriarNovoInsumo}
                            className="insumos-create-btn"
                        >
                            <Plus className="w-4.5 h-4.5 font-bold" />
                            Criar Insumo
                        </button>
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
                                                    R$ {(
                                                        ["kg", "l"].includes(insumo.unidade)
                                                            ? Number(insumo.valorUnitario) * 1000
                                                            : Number(insumo.valorUnitario)
                                                    ).toFixed(2).replace(".", ",")}
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
                                <span className="modal-header-tag print-hide">Ficha Técnica</span>

                                <h2 className="modal-header-title">
                                    {modoEdicao ? (
                                        <input
                                            value={dadosEditados.nome}
                                            onChange={(e) =>
                                                setDadosEditados({
                                                    ...dadosEditados,
                                                    nome: e.target.value,
                                                })
                                            }
                                            className="modal-form-input"
                                            style={{ fontSize: "24px", fontWeight: "bold" }}
                                        />
                                    ) : (
                                        insumoSelecionado?.nome || "Novo Insumo"
                                    )}
                                </h2>

                                <p className="modal-header-subtitle no-print">
                                    Visualização completa dos componentes e rendimento
                                </p>
                            </div>

                            <div className="modal-divider"></div>

                            {/* Yield indicators panel row */}
                            <div className="modal-info-panel-row">
                                <div>
                                    <p className="modal-info-block-label">Rendimento</p>
                                    <span className="modal-info-block-value">
                                        {formatarQuantidade(
                                            Number(modoEdicao ? dadosEditados.qtdLiquida : insumoSelecionado?.qtdLiquida),
                                            modoEdicao ? dadosEditados.unidade : insumoSelecionado?.unidade
                                        )}
                                    </span>
                                </div>

                                <div style={{ textAlign: "right" }}>
                                    <p className="modal-info-block-label">Custo Estimado</p>
                                    <span className="modal-info-block-cost">
                                        R$ {Number(modoEdicao ? dadosEditados.valorTotal : dadosEditados.valorTotal || insumoSelecionado?.valorTotal || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>


                            {/* SUB-INGREDIENT DISH COMPOSITION */}
                            {(modoEdicao ||
                                insumoSelecionado?.transformacao?.ingredientes?.length > 0) && (
                                    <div className="modal-ingredients-section">
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
                                        {(modoEdicao ? dadosEditados.ingredientes : insumoSelecionado?.transformacao?.ingredientes)?.map((ingrediente: any, index: number) => {
                                            console.log("INGREDIENTE ATUAL:", ingrediente);
                                            console.log("INSUMO ENCONTRADO:", insumos.find(
                                                (i: any) => i._id === ingrediente.insumo
                                            ));
                                            const ingredienteCompleto =
                                                insumos.find(
                                                    (i: any) =>
                                                        String(i._id) === String(ingrediente.insumo)
                                                ) || ingrediente;

                                            console.log("ID INGREDIENTE:", ingrediente.insumo);

                                            console.log(
                                                "INSUMO ACHADO:",
                                                insumos.find(
                                                    (i: any) =>
                                                        String(i._id) === String(ingrediente.insumo)
                                                )
                                            );
                                            const custoIngrediente = (Number(ingredienteCompleto?.valorUnitario || 0) * Number(ingrediente.qtdLiquida || 0)).toFixed(2);
                                            console.log("INGREDIENTE COMPLETO:", ingredienteCompleto);
                                            console.log("NOME:", ingredienteCompleto?.nome);
                                            console.log("PESQUISANDO:", ingrediente.pesquisando);
                                            console.log("RENDERIZANDO:", ingredienteCompleto);
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
                                                        >
                                                            <input
                                                                type="text"
                                                                placeholder="🔍 Pesquisar ingrediente..."
                                                                value={pesquisaIngrediente}
                                                                onChange={(e) => setPesquisaIngrediente(e.target.value)}
                                                                className="modal-form-input"
                                                            />

                                                            {pesquisaIngrediente && (
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
                                                                        zIndex: 99999
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

                                                                                setPesquisaIngrediente("");
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
                                                                    console.log("NOVOS INGREDIENTES:", novosIngredientes);


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
                                        })}

                                        {modoEdicao && (
                                            <div style={{ padding: "12px", background: "#0a0f1a", display: "flex", justifyContent: "center" }}>
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
                                                    className="modal-footer-btn print"
                                                    style={{ fontSize: "11px", padding: "6px 12px" }}
                                                >
                                                    + Adicionar Ingrediente
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="modal-divider"></div>

                            {/* Modal action controllers layout footer */}
                            <div className="modal-footer no-print">
                                <div className="modal-btn-group-left">
                                    <button onClick={imprimirFicha} className="modal-footer-btn print">
                                        <Printer className="w-4 h-4" /> Imprimir
                                    </button>
                                    {insumoSelecionado && (
                                        <button onClick={() => deletarInsumo(insumoSelecionado._id)} className="modal-footer-btn delete">
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
                                                    console.log("🔥 ENVIANDO UPDATE INSUMO");

                                                    const ingredientesLimpos = (dadosEditados.ingredientes || [])
                                                        .filter((i: any) => i.insumo)
                                                        .map((item: any) => ({
                                                            insumo: item.insumo,
                                                            qtdLiquida: Number(item.qtdLiquida) || 0,
                                                        }));

                                                    const payload = {
                                                        nome: dadosEditados.nome,
                                                        categoria: dadosEditados.categoria,
                                                        unidade: dadosEditados.unidade,

                                                        // 🔥 AQUI ESTÁ A CORREÇÃO
                                                        qtdBruta: Number(dadosEditados.qtdBruta) || 0,
                                                        qtdLiquida: Number(dadosEditados.qtdLiquida) || 0,
                                                        valorTotal: Number(custoTotal) || 0,

                                                        transformacao: {
                                                            ingredientes: ingredientesLimpos,
                                                        },
                                                    };

                                                    console.log("🔥 PAYLOAD FINAL:", payload);

                                                    await api.put(`/insumos/${insumoSelecionado._id}`, payload);

                                                    alert("Insumo atualizado com sucesso!");
                                                } else {
                                                    await api.post(`/insumos`, {
                                                        nome: dadosEditados.nome,
                                                        categoria: dadosEditados.categoria,
                                                        unidade: dadosEditados.unidade,

                                                        qtdBruta: Number(dadosEditados.qtdBruta) || 0,
                                                        qtdLiquida: Number(dadosEditados.qtdLiquida) || 0,
                                                        valorTotal: Number(custoTotal) || 0,

                                                        transformacao: {
                                                            ingredientes: (dadosEditados.ingredientes || []).map((item: any) => ({
                                                                insumo: item.insumo,
                                                                qtdLiquida: Number(item.qtdLiquida) || 0,
                                                            })),
                                                        },
                                                    });

                                                    alert("Insumo criado com sucesso!");
                                                }

                                                await carregarInsumos();
                                                setModoEdicao(false);
                                                setModalAberto(false);

                                            } catch (error: any) {
                                                console.error(error);
                                                alert("Erro ao salvar insumo: " + (error.response?.data?.message || error.message));
                                            }
                                        }} className="modal-footer-btn save"
                                    >
                                        <Save className="w-4 h-4" />
                                        {modoEdicao ? "Salvar" : "Editar"}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            )
            }
        </div >
    );
}