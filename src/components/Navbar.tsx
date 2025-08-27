import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Agenda Lisboa</h1>
      <div className="flex gap-6">
        <Link href="/" className="hover:text-gray-200">Home</Link>
        <Link href="/sobre" className="hover:text-gray-200">Sobre</Link>
        <Link href="/contacto" className="hover:text-gray-200">Contacto</Link>
        <Link href="/agenda" className="hover:text-gray-200">Agenda</Link>
      </div>
    </nav>
  );
}