// FirstTouch V3 — Tailwind / NativeWind theme extension.
// Colours point at the CSS variables in theme.css, so light (default) and dark switch together.
// On native (no CSS variables), swap each var(...) for the values in tokens.json (theme.light / theme.dark).
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        bg: 'var(--bg)',
        surface: { DEFAULT: 'var(--surface)', 2: 'var(--surface-2)' },
        line: 'var(--line)',
        'input-border': 'var(--input-border)',
        ink: { DEFAULT: 'var(--ink)', 2: 'var(--ink-2)' },
        muted: { DEFAULT: 'var(--muted)', 2: 'var(--muted-2)' },
        brand: { DEFAULT: 'var(--brand)', text: 'var(--brand-text)', on: 'var(--on-brand)', soft: 'var(--brand-soft)', line: 'var(--brand-line)' },
        star: { on: 'var(--star-on)', off: 'var(--star-off)' },
        ok: { bg: 'var(--ok-bg)', fg: 'var(--ok-fg)' },
        morning: { bg: 'var(--amber-bg)', fg: 'var(--amber-fg)', dot: '#F59E0B' },
        unpaid: { bg: 'var(--red-bg)', fg: 'var(--red-fg)', dot: '#DC2626', row: 'var(--red-row-bg)', 'row-border': 'var(--red-row-border)' },
        locked: { bg: 'var(--locked-bg)', fg: 'var(--locked-fg)' },
        team: {
          blue: '#2563EB', 'blue-on': '#FFFFFF', 'blue-text': 'var(--team-blue-text)', 'blue-soft': 'var(--team-blue-soft)',
          yellow: '#F5C518', 'yellow-on': '#1F1A05', 'yellow-text': 'var(--team-yellow-text)', 'yellow-soft': 'var(--team-yellow-soft)',
          red: '#DC2626', 'red-on': '#FFFFFF', 'red-text': 'var(--team-red-text)', 'red-soft': 'var(--team-red-soft)',
          'blue-chip': 'var(--team-blue-chip-bg)', 'blue-chip-fg': 'var(--team-blue-chip-fg)',
          'yellow-chip': 'var(--team-yellow-chip-bg)', 'yellow-chip-fg': 'var(--team-yellow-chip-fg)',
          'red-chip': 'var(--team-red-chip-bg)', 'red-chip-fg': 'var(--team-red-chip-fg)',
          'blue-border': 'var(--team-blue-border)', 'yellow-border': 'var(--team-yellow-border)', 'red-border': 'var(--team-red-border)'
        },
        ball: { fill: 'var(--ball-fill)', patch: 'var(--ball-patch)', line: 'var(--ball-line)' },
        logo: { touch: '#62CC7E', pine: '#34614E', forest: '#1D472B', deep: '#04150F' }
      },
      backgroundImage: {
        page: 'var(--page)',
        button: 'var(--button)',
        hero: 'var(--hero)',
        grass: 'var(--pitch-grass)',
        'card-bar': 'var(--card-bar)',
        'card-bar-closed': 'var(--card-bar-closed)',
        'button-in': 'var(--button-in)',
        'team-blue-wash': 'var(--team-blue-wash)', 'team-yellow-wash': 'var(--team-yellow-wash)', 'team-red-wash': 'var(--team-red-wash)',
        'team-blue-bar': 'var(--team-blue-bar)', 'team-yellow-bar': 'var(--team-yellow-bar)', 'team-red-bar': 'var(--team-red-bar)'
      },
      boxShadow: { card: 'var(--shadow)', 'button-in': 'var(--button-in-shadow)' },
      borderRadius: { badge: '8px', input: '16px', card: '24px', hero: '28px', nav: '26px' },
      minHeight: { tap: '44px' },
      minWidth: { tap: '44px' }
    }
  }
};
