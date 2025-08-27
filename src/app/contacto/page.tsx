"use client";
import { useState } from "react";

export default function Contacto() {
  const [estado, setEstado] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const res = await fetch("https://formspree.io/f/xwpnkqqd", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      setEstado("✅ Mensagem enviada com sucesso!");
      e.currentTarget.reset();
    } else {
      setEstado("❌ Ocorreu um erro. Tente novamente.");
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contacto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" name="nome" placeholder="O seu nome" required className="border p-2 rounded" />
        <input type="email" name="email" placeholder="O seu email" required className="border p-2 rounded" />
        <textarea name="mensagem" placeholder="A sua mensagem" required className="border p-2 rounded h-32"></textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enviar</button>
      </form>
      {estado && <p className="mt-4">{estado}</p>}
    </main>
  );
}