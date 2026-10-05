import { useEffect, useState } from "react";
import { Cog, Brain, Cloud, Code2, Shield } from "lucide-react";

export const About = () => {
  const [text, setText] = useState("");
  const fullText = "$ whoami\n> Ingeniero apasionado por resolver problemas reales de empresas usando IA y arquitecturas limpias. Fundador de 4 SaaS en producción. Especialista en automatización con agentes de IA y diseño de sistemas escalables.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const pipeline = [
    { icon: Brain, title: "Análisis", desc: "Entender el problema real del cliente" },
    { icon: Cog, title: "Arquitectura", desc: "Diseñar sistemas limpios y escalables" },
    { icon: Code2, title: "Clean Code", desc: "Programar con estándares Enterprise" },
    { icon: Cloud, title: "Despliegue", desc: "Subir a la nube con Vercel y Render" },
  ];

  const metrics = [
    { value: "4", label: "SaaS en Producción" },
    { value: "7", label: "Agentes IA Desplegados" },
    { value: "10K+", label: "Líneas de Clean Code" },
    { value: "100%", label: "Arquitectura en Nube" },
  ];

  return (
    <section id="about" className="py-24 px-6 bg-slate-950 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Terminal */}
        <div className="bg-black rounded-2xl border border-slate-800 overflow-hidden mb-16 shadow-2xl">
          <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-500 text-xs ml-2 font-mono">cristian@portfolio: ~</span>
          </div>
          <div className="p-6 font-mono text-sm">
            <pre className="text-green-400 whitespace-pre-wrap leading-relaxed">
              {text}
              <span className="animate-pulse text-sky-400">█</span>
            </pre>
          </div>
        </div>

        {/* Pipeline de Engranajes */}
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Mi Proceso de <span className="text-sky-400">Fabricación</span></h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {pipeline.map((step, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center hover:border-sky-500/50 transition-all group">
              <step.icon className="w-10 h-10 text-sky-400 mx-auto mb-3 group-hover:rotate-180 transition-transform duration-700" />
              <h4 className="text-white font-bold text-sm mb-1">{step.title}</h4>
              <p className="text-slate-500 text-xs">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">{m.value}</p>
              <p className="text-slate-400 text-xs mt-2 uppercase tracking-wide">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};