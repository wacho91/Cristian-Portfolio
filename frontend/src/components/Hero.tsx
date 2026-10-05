export const Hero = () => {
  return (
    <header className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
      {/* Efecto de fondo neuronal básico */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>
      
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