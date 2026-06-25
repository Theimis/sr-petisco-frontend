import { useState } from "react";
import { api } from "../services/api";

export function CadastroInsumo() {
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("");
    const [fornecedor, setFornecedor] = useState("");
    const [unidade, setUnidade] = useState("");
    const [qtdBruta, setQtdBruta] = useState("");
    const [qtdLiquida, setQtdLiquida] = useState("");
    const [valorTotal, setValorTotal] = useState("");

    async function salvar() {
        try {
            await api.post("/insumos", {
                nome,
                categoria,
                fornecedor,
                unidade,
                qtdBruta: Number(qtdBruta),
                qtdLiquida: Number(qtdLiquida) || Number(qtdBruta),
                valorTotal: Number(valorTotal),
            });

            alert("Insumo criado!");

            setNome("");
            setCategoria("");
            setFornecedor("");
            setUnidade("");
            setQtdBruta("");
            setQtdLiquida("");
            setValorTotal("");

        } catch (err: any) {
            console.error(err.response?.data || err);
        }
    }

    return (
        <div>
            <h2>Cadastro de Insumo</h2>

            <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <br /><br />

            <input placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} />
            <br /><br />

            <input placeholder="Fornecedor (opcional)" value={fornecedor} onChange={e => setFornecedor(e.target.value)} />
            <br /><br />

            <select value={unidade} onChange={e => setUnidade(e.target.value)}>
                <option value="">Selecione unidade</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="un">un</option>
            </select>

            <br /><br />

            <input placeholder="Qtd Bruta" type="number" value={qtdBruta} onChange={e => setQtdBruta(e.target.value)} />
            <br /><br />

            <input placeholder="Qtd Líquida" type="number" value={qtdLiquida} onChange={e => setQtdLiquida(e.target.value)} />
            <br /><br />

            <input placeholder="Valor total" type="number" value={valorTotal} onChange={e => setValorTotal(e.target.value)} />
            <br /><br />

            <button onClick={salvar}>Salvar</button>
        </div>
    );
}