import { motion } from "framer-motion";
import { Boxes, Bot, CloudUpload, ShieldCheck } from "lucide-react";

const services = [
  { icon: Boxes, title: "Arquitectura SaaS B2B", desc: "Diseño de sistemas multi-tenant escalables." },
  { icon: Bot, title: "Automatización con IA", desc: "Fábricas de agentes autónomos para procesos complejos." },
  { icon: CloudUpload, title: "Despliegue y Nube", desc: "CI/CD, Docker y arquitecturas Serverless." },
  { icon: ShieldCheck, title: "Ciberseguridad", desc: "Blindaje OWASP y arquitectura Zero Trust." }
];

export const Services = () => {
  return (
    <section className="py-20 px-6 bg-transparent border-y border-slate-800/50 relative z-10">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-12">¿Qué puedo <span className="text-sky-400">construir para ti</span>?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 hover:border-sky-500/40 transition-colors text-left backdrop-blur-sm"
            >
              <s.icon className="w-8 h-8 text-sky-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};