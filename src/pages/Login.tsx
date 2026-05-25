import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

import loginImg from "../assets/login.svg";
import "./login.css";
import toast from "react-hot-toast";

export function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    async function fazerLogin() {

        try {

            const response = await api.post("/auth/login", {
                email,
                senha,
            });


            localStorage.setItem(
                "token",
                response.data.data.token
            );



            toast.success(
                "Usuário conectado com sucesso!"
            );

            navigate("/dashboard");

        } catch (error) {

            toast.error(
                "E-mail ou senha inválidos"
            );

            console.error(error);
        }
    }


    return (
        <div className="login-container">

            {/* ESQUERDA */}
            <div className="login-left">

                <div className="login-logo">
                    ✨ SR Petisco
                </div>

                <div className="login-image-wrapper">
                    <img src={loginImg} alt="Login" className="login-image" />
                </div>

            </div>

            {/* DIREITA */}
            <div className="login-right">

                <div className="login-card">

                    <h1>
                        Bem-vindo ao SR Petisco 👋
                    </h1>

                    <p className="login-subtitle">
                        Faça login para acessar o painel administrativo
                    </p>

                    <div className="input-group">
                        <label>E-mail</label>

                        <input
                            type="email"
                            placeholder="admin@site.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Senha</label>

                        <input
                            type="password"
                            placeholder="••••••••"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <button
                        className="login-button"
                        onClick={fazerLogin}
                    >
                        Entrar
                    </button>

                    <p className="register-text">
                        Ainda não possui acesso?{" "}
                        <span>Registrar credenciais</span>
                    </p>

                    <div className="divider">
                        <div className="divider-line"></div>

                        <span>ou</span>

                        <div className="divider-line"></div>
                    </div>

                </div>

            </div>

        </div>
    );
}