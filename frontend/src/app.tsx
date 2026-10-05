import { Hero } from '../components/Hero';
import { Navbar } from '../components/Navbar';
import { Projects } from '../components/Projects';
import { Footer } from '../components/Footer';

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <Projects />
      <Footer />
    </div>
  );
}