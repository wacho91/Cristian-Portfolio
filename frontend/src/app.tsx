import { NeuralBackground } from './components/NeuralBackground';
import { MetallicGear } from './components/MetallicGear'; // <-- Nuevo import
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Services } from './components/Services';
import { Contact } from './components/Contact';

export function App() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      
      {/* 1. Fondo de Plano Industrial (Cuadrícula) */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      
      {/* 2. Red Neuronal */}
      <NeuralBackground />

      {/* 3. Engranajes Metálicos Gigantes de Fondo Global */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-10">
        <div className="absolute -top-20 -right-32 w-[500px] h-[500px] animate-[spin_40s_linear_infinite]">
          <MetallicGear className="w-full h-full text-slate-700" />
        </div>
        <div className="absolute -bottom-40 -left-32 w-[600px] h-[600px] animate-[spin_50s_linear_infinite_reverse]">
          <MetallicGear className="w-full h-full text-slate-800" />
        </div>
      </div>

      {/* 4. Contenido Principal */}
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Projects />
        <About />
        <Services />
        <Contact />
      </main>
    </div>
  );
}