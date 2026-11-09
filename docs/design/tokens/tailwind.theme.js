// FirstTouch — Tailwind / NativeWind theme extension.
// Colours point at the CSS variables in theme.css so light and Graphite dark switch together.
// On native (no CSS variables), swap each var(...) for the hex values in tokens.json.
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Archivo', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: 'var(--brand)', pressed: 'var(--brand-pressed)', text: 'var(--brand-text)', soft: 'var(--brand-soft)', on: 'var(--on-brand)' },
        bg: 'var(--bg)',
        surface: { DEFAULT: 'var(--surface)', 2: 'var(--surface-2)' },
        line: 'var(--line)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        star: { on: 'var(--star-on)', off: 'var(--star-off)' },
        team: {
          blue: '#2563EB', 'blue-on': '#FFFFFF',
          yellow: '#F5C518', 'yellow-on': '#1F1A05',
          red: '#DC2626', 'red-on': '#FFFFFF'
        },
        paid: { bg: 'var(--paid-bg)', fg: 'var(--paid-fg)' },
        morning: { bg: 'var(--morning-bg)', fg: 'var(--morning-fg)', dot: '#F59E0B' },
        unpaid: { bg: 'var(--unpaid-bg)', fg: 'var(--unpaid-fg)', dot: '#DC2626' },
        pitch: { grass: 'var(--pitch-grass)', stripe: 'var(--pitch-stripe)' },
        logo: { touch: '#62CC7E', pine: '#34614E', forest: '#1D472B', deep: '#04150F' }
      },
      borderRadius: { badge: '8px', input: '16px', card: '22px', 'card-lg': '24px' },
      minHeight: { tap: '44px' },
      minWidth: { tap: '44px' }
    }
  }
};
