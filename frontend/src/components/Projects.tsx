import { motion } from "framer-motion";
import { Cog, Leaf, Fish, ShoppingCart, LucideIcon } from "lucide-react";

interface Project {
  name: string;
  desc: string;
  tech: string;
  color: string;
  icon: LucideIcon;
  img: string;
  demo: string;
  code: string;
}

const projects: Project[] = [
  { 
    name: "Khazad-dum", 
    desc: "ERP FacilityTech para mantenimiento industrial y control de costos TCO.", 
    tech: "FastAPI, React, PostgreSQL", 
    color: "from-sky-500/20 to-indigo-500/20",
    icon: Cog,
    // Ruta corregida
    img: "/khazad-dum.png", 
    demo: "https://khazad-dum-two.vercel.app", 
    code: "https://github.com/wacho91" 
  },
  { 
    name: "AgroFlow", 
    desc: "SaaS AgroTech para gestión de fincas, costeo en tiempo real y API climática.", 
    tech: "FastAPI, React, Supabase", 
    color: "from-emerald-500/20 to-teal-500/20",
    icon: Leaf,
    // Ruta corregida
    img: "/agroFlow.png",
    demo: "https://agro-flow-one.vercel.app", 
    code: "https://github.com/wacho91" 
  },
  { 
    name: "FishSinu", 
    desc: "ERP para pescadería con inventario fraccionario (kilos) y créditos.", 
    tech: "FastAPI, React, Supabase", 
    color: "from-cyan-500/20 to-blue-500/20",
    icon: Fish,
    // Ruta corregida
    img: "/fishsinu.png",
    demo: "https://fish-sinu-mzn7.vercel.app", 
    code: "https://github.com/wacho91"  
  },
  { 
    name: "NexoERP", 
    desc: "Sistema de gestión de tienda virtual con facturación electrónica.", 
    tech: "FastAPI, React, Supabase", 
    color: "from-amber-500/20 to-orange-500/20",
    icon: ShoppingCart,
    // Ruta corregida
    img: "/nexoERP.png",
    demo: "https://nexo-erp-sepia.vercel.app/login", 
    code: "https://github.com/wacho91"  
  }
];

export const Projects = () => {
  return (
    <section id="projects" className="py-24 px-6 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white mb-12 text-center"
        >
          Mi <span className="text-sky-400">Ecosistema</span> SaaS
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${p.color} border border-slate-700 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group cursor-pointer backdrop-blur-sm flex flex-col`}
            >
              {/* Imagen Superior */}
              <div className="h-48 w-full overflow-hidden border-b border-slate-700">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              {/* Contenido Inferior */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-white">{p.name}</h3>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700">
                    <p.icon className="w-5 h-5 text-sky-400" />
                  </div>
                </div>
                <p className="text-slate-300 mb-6 flex-grow text-sm">{p.desc}</p>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-xs font-mono text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full">{p.tech}</span>
                  <div className="flex gap-4">
                    {/* Ahora todos los botones son clickeables */}
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-400 hover:underline font-medium">Ver Demo</a>
                    <a href={p.code} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors">Código</a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}