import { NeuralBackground } from './components/NeuralBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Contact } from './components/Contact';

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      <NeuralBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
    </div>
  );
}