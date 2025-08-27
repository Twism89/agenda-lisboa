"use client";

import { useEffect, useState } from "react";

export default function Agenda() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");

  const hoje = new Date();

  // Função para ordenar eventos por data
  const ordenarEventosPorData = (lista: any[]) =>
    lista.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  // Verifica se evento é passado
  const isPassado = (dataEvento: string) => new Date(dataEvento) < hoje;

  // Buscar eventos da API
  useEffect(() => {
    setLoading(true);
    fetch("/api/eventos")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((dados) => setEventos(ordenarEventosPorData(dados)))
      .catch(() => setMensagem("❌ Erro ao carregar eventos"))
      .finally(() => setLoading(false));
  }, []);

  // Adicionar evento
  const adicionarEvento = async () => {
    if (!titulo || !data) {
      setMensagem("⚠️ Preenche todos os campos");
      return;
    }

    try {
      const res = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, data }),
      });
      if (!res.ok) throw new Error("Erro ao adicionar evento");

      const novoEvento = await res.json();
      setEventos(ordenarEventosPorData([...eventos, novoEvento]));
      setTitulo("");
      setData("");
      setMensagem("✅ Evento adicionado com sucesso!");
    } catch {
      setMensagem("❌ Erro ao adicionar evento");
    }
  };

  // Remover evento
  const removerEvento = async (id: number) => {
    try {
      const res = await fetch(`/api/eventos?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao apagar evento");

      setEventos(eventos.filter((e) => e.id !== id));
      setMensagem("✅ Evento apagado com sucesso!");
    } catch {
      setMensagem("❌ Erro ao apagar evento");
    }
  };

  // Evento mais próximo da data atual
  const eventoMaisProximo =
    eventos.length > 0
      ? eventos.reduce((prev, curr) => {
          const diffPrev = Math.abs(new Date(prev.data).getTime() - hoje.getTime());
          const diffCurr = Math.abs(new Date(curr.data).getTime() - hoje.getTime());
          return diffCurr < diffPrev ? curr : prev;
        })
      : null;

  return (
    <main className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Agenda</h1>

      {mensagem && (
        <p className="mb-4 text-center text-sm font-medium">{mensagem}</p>
      )}

      <div className="flex flex-col gap-2 mb-6">
        <input
          type="text"
          placeholder="Título do evento"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={adicionarEvento}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
        >
          Adicionar Evento
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Carregando eventos...</p>
      ) : eventos.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum evento cadastrado.</p>
      ) : (
        <ul className="space-y-4">
          {eventos.map((e) => (
            <li
              key={e.id}
              className={`border p-4 rounded shadow-sm flex justify-between items-center
                ${e.id === eventoMaisProximo?.id ? "border-2 border-blue-500" : ""}
                ${isPassado(e.data) ? "bg-gray-100 text-gray-500" : "bg-green-50"}
              `}
            >
              <div>
                <h2 className="text-xl font-semibold">{e.titulo}</h2>
                <p className="text-gray-600">📅 {e.data}</p>
              </div>
              <button
                onClick={() => removerEvento(e.id)}
                className="text-red-600 hover:text-red-800"
              >
                Apagar
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}