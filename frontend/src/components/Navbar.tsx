export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-400 tracking-widest">Cristian.Dev</h1>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <a href="#projects" className="hover:text-sky-400 transition-colors">Proyectos</a>
          <a href="#about" className="hover:text-sky-400 transition-colors">Acerca de Mí</a>
          <a href="#contact" className="hover:text-sky-400 transition-colors">Contacto</a>
        </div>
      </div>
    </nav>
  );
};