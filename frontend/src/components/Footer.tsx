export const Footer = () => {
  return (
    <footer id="contact" className="py-20 px-6 bg-slate-900 border-t border-slate-800 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-4">¿Tienes un problema complejo?</h2>
        <p className="text-slate-400 mb-8">Construyamos la solución juntos.</p>
        <a href="mailto:tucorreo@dev.com" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105">
          Construyamos la solución
        </a>
        <p className="mt-12 text-slate-500 text-sm">© 2024 Cristian - Arquitecto de Software. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};