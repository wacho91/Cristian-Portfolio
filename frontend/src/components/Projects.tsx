// Datos de tus 4 SaaS
const projects = [
  { name: "Khazad-dum", desc: "ERP FacilityTech para mantenimiento industrial y control de costos TCO.", tech: "FastAPI, React, PostgreSQL", color: "from-sky-500/20 to-indigo-500/20" },
  { name: "AgroFlow", desc: "SaaS AgroTech para gestión de fincas, costeo en tiempo real y API climática.", tech: "FastAPI, React, Supabase", color: "from-emerald-500/20 to-teal-500/20" },
  { name: "FishSinu", desc: "ERP para pescadería con inventario fraccionario (kilos) y créditos.", tech: "FastAPI, React, SQLite", color: "from-cyan-500/20 to-blue-500/20" },
  { name: "NexoERP", desc: "Sistema de gestión de tienda virtual con facturación electrónica.", tech: "FastAPI, React, SQLite", color: "from-amber-500/20 to-orange-500/20" }
];

export const Projects = () => {
  return (
    <section id="projects" className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Mi <span className="text-sky-400">Ecosistema</span> SaaS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <div key={i} className={`bg-gradient-to-br ${p.color} border border-slate-700 rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300 group cursor-pointer`}>
              <h3 className="text-2xl font-bold text-white mb-3">{p.name}</h3>
              <p className="text-slate-300 mb-6 h-20">{p.desc}</p>
              <div className="flex justify-between items-end">
                <span className="text-xs font-mono text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full">{p.tech}</span>
                <div className="flex gap-4">
                  <a href="#" className="text-sm text-sky-400 hover:underline">Ver Demo</a>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Código</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};