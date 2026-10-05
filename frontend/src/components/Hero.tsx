export const Hero = () => {
  return (
    <header className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
      {/* Efecto de fondo neuronal básico translúcido */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 to-slate-950 z-0"></div>
      
      {/* Engranajes Gigantes de Fondo */}
      <div className="absolute top-20 -right-20 opacity-5 text-sky-500 animate-[spin_30s_linear_infinite] hidden md:block">
        <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-2.5-7.5l-1.4 1.4M5.9 18.1l-1.4 1.4m0-14.2l1.4 1.4m12.2 12.2l1.4 1.4M12 7a5 5 0 100 10 5 5 0 000-10z"/>
        </svg>
      </div>
      <div className="absolute -bottom-20 -left-20 opacity-5 text-indigo-500 animate-[spin_25s_linear_infinite_reverse] hidden md:block">
        <svg width="350" height="350" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-2.5-7.5l-1.4 1.4M5.9 18.1l-1.4 1.4m0-14.2l1.4 1.4m12.2 12.2l1.4 1.4M12 7a5 5 0 100 10 5 5 0 000-10z"/>
        </svg>
      </div>
      
      <div className="z-10 flex flex-col items-center">
        <p className="text-sky-400 font-mono mb-4 tracking-widest">$ init_system --user=cristian</p>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          Arquitecto de Software <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">& Visionario SaaS</span>
        </h1>
        <p className="text-slate-400 max-w-2xl text-lg mb-8">
          Backend Architect • FastAPI Expert • AI Agent Developer • React Wizard
        </p>
        <a href="#projects" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-sky-500/30">
          Explorar mi Ecosistema
        </a>
      </div>
    </header>
  );
};