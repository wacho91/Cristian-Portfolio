import { useState } from "react";
import { Mail, Github, Linkedin, Send } from "lucide-react";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

    const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Cambia esta URL por la de tu backend local o el de Render cuando lo subas
      const res = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (data.success) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 3000);
      } else {
        alert("Hubo un error al enviar el mensaje.");
      }
    } catch (err) {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-transparent relative z-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-4 text-center">
          ¿Tienes un <span className="text-sky-400">problema complejo</span>?
        </h2>
        <p className="text-slate-400 text-center mb-12">Construyamos la solución juntos.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Info de contacto */}
          <div className="space-y-6">
            <a href="mailto:criskol.71@gmail.com" className="flex items-center gap-4 text-slate-300 hover:text-sky-400 transition-colors group">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 group-hover:border-sky-500/50 transition-colors">
                <Mail className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Email</p>
                <p className="font-medium">criskol.71@gmail.com</p>
              </div>
            </a>

            <a href="https://github.com/wacho91" className="flex items-center gap-4 text-slate-300 hover:text-sky-400 transition-colors group">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 group-hover:border-sky-500/50 transition-colors">
                <Github className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">GitHub</p>
                <p className="font-medium">github.com/wacho91</p>
              </div>
            </a>

            <a href="www.linkedin.com/in/cristian-gonzalez-fuentes-developerfullstack" className="flex items-center gap-4 text-slate-300 hover:text-sky-400 transition-colors group">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 group-hover:border-sky-500/50 transition-colors">
                <Linkedin className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">LinkedIn</p>
                <p className="font-medium">www.linkedin.com/in/cristian-gonzalez-fuentes-developerfullstack</p>
              </div>
            </a>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-1">Nombre</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-1">Mensaje</label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none"
                placeholder="Cuéntame sobre tu proyecto..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2"
            >
              {sent ? "¡Mensaje Enviado! ✅" : "Enviar Mensaje"}
              {!sent && <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <p className="mt-16 text-slate-600 text-center text-sm">© 2024 Cristian - Arquitecto de Software. Todos los derechos reservados.</p>
      </div>
    </section>
  );
};