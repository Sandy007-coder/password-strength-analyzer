/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        void:    '#02060f',
        deep:    '#050e1f',
        card:    '#081528',
        raised:  '#0c1e38',

        cyan:         '#00b4ff',
        'cyan-bright': '#33ccff',

        'green-neo':  '#00ffa3',
        'red-neo':    '#ff2d55',
        'yellow-neo': '#ffd60a',
        'orange-neo': '#ff6b35',

        txt:       '#d4eaf7',
        'txt-dim':  '#5a8aaa',
        'txt-void': '#2d5a7a',
      },

      fontFamily: {
        display: ['Orbitron',       'monospace'],
        body:    ['Rajdhani',       'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },

      boxShadow: {
        neon:        '0 0 20px rgba(0,180,255,0.25), 0 0 60px rgba(0,180,255,0.08)',
        'neon-green': '0 0 20px rgba(0,255,163,0.35)',
        'neon-red':   '0 0 20px rgba(255,45,85,0.35)',
      },
    },
  },

  plugins: [],
}