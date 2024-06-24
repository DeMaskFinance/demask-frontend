import About from "@/components/About";
import Ecosystem from "@/components/Ecosystem";
import Features from "@/components/Features";
import Values from "@/components/Values";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <About />
      <Values />
      <Features />
      <Ecosystem />
    </main>
  );
}
