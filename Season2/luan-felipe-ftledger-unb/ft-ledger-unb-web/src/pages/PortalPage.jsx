// src/pages/PortalPage.jsx
import React, { useState, useRef, useEffect } from "react";

// URL do backend vem do .env ou cai no localhost
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

// Categorias de documento com ícones
const DOC_CATEGORIES = [
  {
    value: "textos",
    label: "Textos, relatórios e apresentações",
    icon: "📄",
  },
  {
    value: "cad",
    label: "CAD, modelagem 3D e BIM",
    icon: "📐",
  },
  {
    value: "eletronica",
    label: "Eletrônica, esquemáticos e PCB",
    icon: "🔌",
  },
  {
    value: "simulacoes",
    label: "Simulações (FEA, CFD, controle, etc.)",
    icon: "🧪",
  },
  {
    value: "software",
    label: "Programação e software",
    icon: "💻",
  },
  {
    value: "dados",
    label: "Dados, logs e resultados",
    icon: "📊",
  },
  {
    value: "imagens",
    label: "Imagens, gráficos, sinais e áudio",
    icon: "🖼️",
  },
  {
    value: "gis",
    label: "GIS / geoprocessamento",
    icon: "🗺️",
  },
  {
    value: "redes",
    label: "Redes, segurança e tráfego",
    icon: "🌐",
  },
  {
    value: "estatistica",
    label: "Estatística, otimização e análise",
    icon: "📈",
  },
];

const CATEGORY_MAP = DOC_CATEGORIES.reduce((acc, cat) => {
  acc[cat.value] = cat;
  return acc;
}, {});

function formatFileSize(bytes) {
  if (bytes == null) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} kB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR");
}

export default function PortalPage() {
  const [file, setFile] = useState(null);
  const [hashHex, setHashHex] = useState("");
  const [docCategory, setDocCategory] = useState("textos");

  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // Histórico vindo do backend
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("all");

  // Carrega o histórico do backend ao abrir a página
  useEffect(() => {
    async function fetchHistory() {
      setLoadingHistory(true);
      setHistoryError("");
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoadingHistory(false);
        return;
      }

      try {
        const r = await fetch(`${API_BASE_URL}/uploads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!r.ok) {
          throw new Error("Falha ao carregar histórico");
        }

        const data = await r.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setHistoryError("Não foi possível carregar o histórico de envios.");
      } finally {
        setLoadingHistory(false);
      }
    }

    fetchHistory();
  }, []);

  async function onFile(f) {
    setFile(f);
    setResult(null);
    setError("");

    if (!f) {
      setHashHex("");
      return;
    }

    try {
      const buf = await f.arrayBuffer();
      const h = await crypto.subtle.digest("SHA-256", buf);
      const hex = Array.from(new Uint8Array(h))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setHashHex(hex);
    } catch (e) {
      console.error(e);
      setError("Erro ao calcular SHA-256 do arquivo.");
    }
  }

  async function doUpload() {
    if (!file) {
      setError("Selecione um arquivo.");
      return;
    }

    setUploading(true);
    setError("");
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      if (hashHex) fd.append("sha256", hashHex);
      fd.append("category", docCategory);

      const token = localStorage.getItem("authToken");

      const r = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: fd,
      });

      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Falha no upload");

      const uploaded = j.upload || null;
      const uploadedAt = uploaded?.uploadedAt || new Date().toISOString();

      const category =
        uploaded?.category && CATEGORY_MAP[uploaded.category]
          ? uploaded.category
          : docCategory;

      const fullResult = {
        name: uploaded?.name || file.name,
        size: uploaded?.size ?? file.size,
        sha256: uploaded?.sha256 || j.sha256 || hashHex,
        fid: uploaded?.fidLocal || j.fid || null,
        deossOk: j.deoss?.ok ?? uploaded?.deossOk ?? false,
        deossFid: j.deoss?.fid ?? uploaded?.fidCess ?? null,
        uploadedAt,
        category,
      };

      setResult(fullResult);

      // Atualiza histórico em memória para já aparecer no modal
      setHistory((prev) => [
        {
          id: uploaded?.id || Date.now(),
          name: fullResult.name,
          size: fullResult.size,
          sha256: fullResult.sha256,
          category,
          fidLocal: uploaded?.fidLocal || j.fid || null,
          fidCess: fullResult.deossFid || null,
          deossOk: fullResult.deossOk,
          uploadedAt,
        },
        ...prev,
      ]);
    } catch (e) {
      console.error(e);
      setError(e.message || "Erro inesperado no upload");
    } finally {
      setUploading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  const filteredHistory =
    historyFilter === "all"
      ? history
      : history.filter((item) => item.category === historyFilter);

  // Contadores
  const totalCount = history.length;
  const categoryCounts = DOC_CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = history.filter((item) => item.category === cat.value).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Header com logo, histórico e sair */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logos/unblogo.png"
              alt="UnB | Faculdade de Tecnologia"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <div className="text-sm text-gray-700 font-semibold">
              FT-Ledger UnB
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão 3 pontinhos -> histórico de envios */}
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors text-lg"
              title="Histórico de envios"
            >
              ⋯
            </button>

            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-900 hover:text-white transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-5xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Portal de Entrega</h1>
          <p className="text-gray-600 mt-1">
            Envie seus artefatos de engenharia, gere o SHA-256 e registre o envio
            no backend e na CESS (DeOSS).
          </p>
        </div>

        {/* Card: upload + SHA-256 + FID */}
        <section className="bg-white rounded-2xl shadow border border-gray-100 p-5">
          <h2 className="font-semibold mb-3">Envio de arquivo</h2>

          {/* Tipo de documento */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Tipo de documento
            </label>
            <select
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              className="w-full sm:max-w-md border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {DOC_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Essa escolha define em qual aba do histórico o arquivo vai aparecer
              (Textos, CAD, Simulações, Software, etc.).
            </p>
          </div>

          {/* Botão de upload + info do arquivo */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-900 text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
            >
              Clique aqui para selecionar o arquivo
            </button>

            {file && (
              <span className="text-sm text-gray-600">
                Arquivo selecionado:{" "}
                <span className="font-medium">{file.name}</span>{" "}
                <span className="text-xs text-gray-400">
                  ({formatFileSize(file.size)})
                </span>
              </span>
            )}
          </div>

          {file && (
            <div className="mt-4 text-sm">
              <div className="break-all mt-1">
                <b>SHA-256:</b>{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {hashHex || "calculando..."}
                </code>
              </div>

              <button
                onClick={doUpload}
                disabled={!file || uploading}
                className={`mt-3 px-4 py-2 rounded-xl border border-gray-900 text-sm font-medium ${
                  !file || uploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-900 hover:text-white transition-colors"
                }`}
              >
                {uploading ? "Enviando…" : "Enviar arquivo"}
              </button>

              {error && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <div className="font-semibold mb-2">✅ Envio concluído</div>

                  <div className="text-sm space-y-1">
                    <div>
                      <b>Nome:</b> {result.name}{" "}
                      <span className="text-xs text-gray-500">
                        ({formatFileSize(result.size)})
                      </span>
                    </div>

                    <div>
                      <b>Tipo de documento:</b>{" "}
                      {CATEGORY_MAP[result.category || docCategory]?.icon}{" "}
                      {CATEGORY_MAP[result.category || docCategory]?.label}
                    </div>

                    {/* FID local */}
                    <div className="break-all">
                      <b>FID local:</b>{" "}
                      <code className="bg-white px-2 py-1 rounded border text-xs">
                        {result.fid || "—"}
                      </code>
                    </div>

                    {/* FID da CESS */}
                    <div className="break-all">
                      <b>FID CESS:</b>{" "}
                      <code className="bg-white px-2 py-1 rounded border text-xs">
                        {result.deossFid && result.deossOk
                          ? result.deossFid
                          : "—"}
                      </code>
                    </div>

                    {/* Status CESS */}
                    <div>
                      <b>Status CESS:</b>{" "}
                      {result.deossOk ? (
                        <span className="text-emerald-700 font-medium">
                          Sincronizado com a CESS
                        </span>
                      ) : (
                        <span className="text-orange-600">
                          Apenas salvo localmente
                        </span>
                      )}
                    </div>

                    <div className="break-all">
                      <b>SHA-256:</b>{" "}
                      <code className="bg-white px-2 py-1 rounded border text-xs">
                        {result.sha256}
                      </code>
                    </div>
                    <div>
                      <b>Quando:</b> {formatDate(result.uploadedAt)}
                    </div>
                  </div>

                  {result.fid && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {/* Botão de download simples e bonito */}
                      <a
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
                        href={`${API_BASE_URL}/download/${result.fid}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>⬇️</span>
                        <span>Baixar arquivo enviado</span>
                      </a>

                      {result.deossOk && result.deossFid && (
                        <button
                          type="button"
                          className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-emerald-600 text-xs font-medium text-emerald-700 bg-white hover:bg-emerald-50 transition-colors"
                          onClick={() =>
                            navigator.clipboard.writeText(result.deossFid)
                          }
                        >
                          Copiar FID CESS
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        <footer className="text-xs text-gray-500 mt-8">
          <p>
            Este portal calcula o hash SHA-256, registra o envio no backend e,
            quando possível, sincroniza o arquivo com o DeOSS da CESS (território
            &quot;ftledger&quot;). O histórico de envios é salvo no banco SQLite
            por usuário autenticado.
          </p>
        </footer>
      </main>

      {/* Painel de histórico (abre pelo botão ⋯) */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-30">
          <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col">
            <header className="px-5 py-3 border-b flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  Histórico de envios{" "}
                  <span className="text-xs text-gray-500">
                    ({totalCount} arquivo{totalCount === 1 ? "" : "s"})
                  </span>
                </h2>
                <p className="text-xs text-gray-500">
                  Filtre por tipo de documento para encontrar rapidamente um
                  envio anterior.
                </p>
                {historyError && (
                  <p className="text-xs text-red-600 mt-1">{historyError}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                title="Fechar"
              >
                ✕
              </button>
            </header>

            <div className="px-5 pt-3 pb-2 border-b">
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-full text-xs border ${
                    historyFilter === "all"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => setHistoryFilter("all")}
                >
                  🔎 Todos ({totalCount})
                </button>
                {DOC_CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat.value] || 0;
                  return (
                    <button
                      key={cat.value}
                      className={`px-3 py-1.5 rounded-full text-xs border flex items-center gap-1 ${
                        historyFilter === cat.value
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                      onClick={() => setHistoryFilter(cat.value)}
                    >
                      <span>{cat.icon}</span>
                      <span className="hidden sm:inline">
                        {cat.label} ({count})
                      </span>
                      <span className="sm:hidden">
                        {cat.label.split(",")[0]} ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-auto px-5 py-3">
              {loadingHistory ? (
                <p className="text-sm text-gray-500">
                  Carregando histórico de envios...
                </p>
              ) : filteredHistory.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhum envio encontrado para esse filtro. Assim que você
                  registrar arquivos nessa categoria, eles aparecerão aqui.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left px-2 py-2 font-medium text-gray-700">
                          Data
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-gray-700">
                          Tipo
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-gray-700">
                          Arquivo
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-gray-700">
                          Tam.
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-gray-700">
                          SHA-256
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-gray-700">
                          FID CESS
                        </th>
                        <th className="text-left px-2 py-2 font-medium text-gray-700">
                          Download
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((item) => {
                        const cat = CATEGORY_MAP[item.category];
                        return (
                          <tr
                            key={item.id}
                            className="border-b last:border-0 hover:bg-gray-50"
                          >
                            <td className="px-2 py-2 whitespace-nowrap">
                              {formatDate(item.uploadedAt)}
                            </td>
                            <td className="px-2 py-2">
                              {cat ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                  <span>{cat.icon}</span>
                                  <span className="hidden sm:inline">
                                    {cat.label}
                                  </span>
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="px-2 py-2 max-w-[180px] truncate">
                              {item.name}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              {formatFileSize(item.size)}
                            </td>
                            <td className="px-2 py-2 max-w-[200px] truncate">
                              {item.sha256 || "—"}
                            </td>
                            <td className="px-2 py-2 max-w-[180px] truncate">
                              {item.fidCess || "—"}
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              {item.fidLocal ? (
                                <a
                                  href={`${API_BASE_URL}/download/${item.fidLocal}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-gray-900 text-[11px] hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                  ⬇️ Baixar
                                </a>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="px-5 py-2 border-t text-[11px] text-gray-500">
              Histórico armazenado no banco SQLite (<code>auth.db</code>), por
              usuário autenticado. Pode ser acessado de qualquer dispositivo após
              login.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
