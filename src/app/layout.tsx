import Navbar from "../components/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <Navbar />   {/* Navbar apenas aqui */}
        {children}   {/* Conteúdo específico da página */}
      </body>
    </html>
  );
}