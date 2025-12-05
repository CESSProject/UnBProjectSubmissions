// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // campos de cadastro
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [course, setCourse] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isRegister = mode === "register";

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const baseUrl = "http://localhost:3001";

      if (isRegister) {
        // cadastro
        const res = await fetch(`${baseUrl}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            matricula,
            course,
          }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || "Erro ao criar conta");
        }

        const data = await res.json();
        const token = data.token;

        if (!token) {
          throw new Error("Token não retornado pelo backend");
        }

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/portal");
      } else {
        // login
        const res = await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || "Credenciais inválidas");
        }

        const data = await res.json();
        const token = data.token;

        if (!token) {
          throw new Error("Token não retornado pelo backend");
        }

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/portal");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Erro ao enviar formulário");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-xl bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-700">
        <h1 className="text-2xl font-semibold text-slate-50 mb-2 text-center">
          FT-Ledger UnB
        </h1>
        <p className="text-slate-400 text-sm mb-6 text-center">
          Portal de Entrega de Artefatos Acadêmicos
        </p>

        {/* Abas Entrar / Criar conta */}
        <div className="flex mb-6 rounded-xl bg-slate-900/60 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm rounded-lg ${
              mode === "login"
                ? "bg-emerald-500 text-slate-900 font-semibold"
                : "text-slate-300 hover:bg-slate-700/60"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-sm rounded-lg ${
              mode === "register"
                ? "bg-emerald-500 text-slate-900 font-semibold"
                : "text-slate-300 hover:bg-slate-700/60"
            }`}
          >
            Criar conta
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-500/40 rounded-md px-3 py-2">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={isRegister}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={isRegister}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Matrícula
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    required={isRegister}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Curso (Engenharia)
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required={isRegister}
                  >
                    <option value="">Selecione o curso</option>

                    {/* Graduação */}
                    <option value="Engenharia Ambiental">
                      Engenharia Ambiental
                    </option>
                    <option value="Engenharia Civil">Engenharia Civil</option>
                    <option value="Engenharia de Computação">
                      Engenharia de Computação
                    </option>
                    <option value="Engenharia Elétrica">
                      Engenharia Elétrica
                    </option>
                    <option value="Engenharia Florestal">
                      Engenharia Florestal
                    </option>
                    <option value="Engenharia Mecânica">
                      Engenharia Mecânica
                    </option>
                    <option value="Engenharia Mecatrônica">
                      Engenharia Mecatrônica
                    </option>
                    <option value="Engenharia de Produção">
                      Engenharia de Produção
                    </option>
                    <option value="Engenharia Química">
                      Engenharia Química
                    </option>
                    <option value="Engenharia de Redes de Comunicação">
                      Engenharia de Redes de Comunicação
                    </option>
                    <option value="Engenharia Automotiva">
                      Engenharia Automotiva
                    </option>
                    <option value="Engenharia Aeroespacial">
                      Engenharia Aeroespacial
                    </option>
                    <option value="Engenharia Eletrônica">
                      Engenharia Eletrônica
                    </option>
                    <option value="Engenharia de Energia">
                      Engenharia de Energia
                    </option>
                    <option value="Engenharia de Software">
                      Engenharia de Software
                    </option>

                    {/* Pós / Mestrado */}
                    <option value="Engenharia Biomédica (Mestrado)">
                      Engenharia Biomédica (Mestrado)
                    </option>
                    <option value="Integridade de Materiais da Engenharia (Mestrado)">
                      Integridade de Materiais da Engenharia (Mestrado)
                    </option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              E-mail institucional
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="matricula@aluno.unb.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Senha</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-medium py-2.5 text-sm transition"
          >
            {isSubmitting
              ? isRegister
                ? "Criando conta..."
                : "Entrando..."
              : isRegister
              ? "Criar conta"
              : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500 text-center">
          Os dados de cadastro são persistidos no backend (SQLite), e o acesso
          ao Portal de Entrega é protegido por token JWT.
        </p>
      </div>
    </div>
  );
}
