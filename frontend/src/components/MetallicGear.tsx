export const MetallicGear = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#000" floodOpacity="0.8"/>
      </filter>
    </defs>
    <path 
      d="M278.9,38.5l-12.9,51.2c-14.4,3.2-28.2,8.2-41,14.8l-45.2-28.8l-60.2,60.2l28.8,45.2c-6.6,12.8-11.6,26.6-14.8,41l-51.2,12.9v85.2l51.2,12.9c3.2,14.4,8.2,28.2,14.8,41l-28.8,45.2l60.2,60.2l45.2-28.8c12.8,6.6,26.6,11.6,41,14.8l12.9,51.2h85.2l12.9-51.2c14.4-3.2,28.2-8.2,41-14.8l45.2,28.8l60.2-60.2l-28.8-45.2c6.6-12.8,11.6-26.6,14.8-41l51.2-12.9v-85.2l-51.2-12.9c-3.2-14.4-8.2-28.2-14.8-41l28.8-45.2l-60.2-60.2l-45.2,28.8c-12.8-6.6-26.6-11.6-41-14.8l-12.9-51.2H278.9z M321.5,191.3c42.4,0,76.7,34.3,76.7,76.7s-34.3,76.7-76.7,76.7s-76.7-34.3-76.7-76.7S279.1,191.3,321.5,191.3z" 
      fill="url(#metalGrad)" 
      filter="url(#innerShadow)"
    />
    {/* Anillo interior brillante para dar el toque tecnológico */}
    <circle cx="321.5" cy="268" r="40" fill="none" stroke="#38bdf8" strokeWidth="6" opacity="0.5" />
  </svg>
);