export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "eventos.json");

function lerEventos() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function gravarEventos(eventos: any) {
  fs.writeFileSync(filePath, JSON.stringify(eventos, null, 2));
}

export async function GET() {
  try {
    return NextResponse.json(lerEventos());
  } catch (err) {
    return NextResponse.json({ error: "Erro ao ler eventos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const eventos = lerEventos();
    const novoEvento = { id: Date.now(), ...body };
    eventos.push(novoEvento);
    gravarEventos(eventos);
    return NextResponse.json(novoEvento);
  } catch (err) {
    return NextResponse.json({ error: "Erro ao adicionar evento" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    let eventos = lerEventos();
    eventos = eventos.filter((e: any) => e.id !== id);
    gravarEventos(eventos);

    return NextResponse.json({ message: "Evento removido" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao apagar evento" }, { status: 500 });
  }
}