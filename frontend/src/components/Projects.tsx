// Datos de tus 4 SaaS con links reales
const projects = [
  { 
    name: "Khazad-dum", 
    desc: "ERP FacilityTech para mantenimiento industrial y control de costos TCO.", 
    tech: "FastAPI, React, PostgreSQL", 
    color: "from-sky-500/20 to-indigo-500/20",
    demo: "https://khazad-dum-two.vercel.app/login", // <--- Pon aquí tu link de Vercel de Khazad-dum
    code: "https://github.com/wacho91/Khazad-dum" // <--- Pon aquí tu link de GitHub
  },
  { 
    name: "AgroFlow", 
    desc: "SaaS AgroTech para gestión de fincas, costeo en tiempo real y API climática.", 
    tech: "FastAPI, React, Supabase", 
    color: "from-emerald-500/20 to-teal-500/20",
    demo: "https://agro-flow-one.vercel.app/login", // <--- Link de Vercel de AgroFlow
    code: "https://github.com/wacho91/AgroFlow" // <--- Link de GitHub de AgroFlow
  },
  { 
    name: "FishSinu", 
    desc: "ERP para pescadería con inventario fraccionario (kilos) y créditos.", 
    tech: "FastAPI, React, SQLite", 
    color: "from-cyan-500/20 to-blue-500/20",
    demo: "https://fish-sinu.vercel.app/login", // <--- Pon aquí tu link de Vercel de FishSinu si lo subiste
    code: "https://github.com/wacho91/FishSinu"  // <--- Pon aquí tu link de GitHub de FishSinu
  },
  { 
    name: "NexoERP", 
    desc: "Sistema de gestión de tienda virtual con facturación electrónica.", 
    tech: "FastAPI, React, SQLite", 
    color: "from-amber-500/20 to-orange-500/20",
    demo: "https://nexo-erp-sepia.vercel.app/login", // <--- Pon aquí tu link de Vercel de NexoERP si lo subiste
    code: "https://github.com/wacho91/NexoERP"  // <--- Pon aquí tu link de GitHub de NexoERP
  }
];

export const Projects = () => {
  return (
    <section id="projects" className="py-24 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Mi <span className="text-sky-400">Ecosistema</span> SaaS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div key={i} className={`bg-gradient-to-br ${p.color} border border-slate-700 rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300 group cursor-pointer backdrop-blur-sm`}>
              <h3 className="text-2xl font-bold text-white mb-3">{p.name}</h3>
              <p className="text-slate-300 mb-6 h-20">{p.desc}</p>
              <div className="flex justify-between items-end">
                <span className="text-xs font-mono text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full">{p.tech}</span>
                <div className="flex gap-4">
                  {/* Si el link es '#', el botón no hace nada. Si es un link, lo abre en otra pestaña */}
                  {p.demo !== '#' ? (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-400 hover:underline font-medium">Ver Demo</a>
                  ) : (
                    <span className="text-sm text-slate-600 cursor-not-allowed">Demo Local</span>
                  )}
                  {p.code !== '#' ? (
                    <a href={p.code} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors">Código</a>
                  ) : (
                    <span className="text-sm text-slate-600 cursor-not-allowed">Privado</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};