// TEMPORARY test page (T-05): shows every colour, gradient, shadow and radius in the current theme.
// Dev only: outside development it just sends you home. Open http://localhost:8081/swatches
import { Redirect } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTheme, type ThemeMode } from '../lib/theme';

const MODES: ThemeMode[] = ['light', 'dark', 'system'];
// Whole class names, so Tailwind can find them when it scans this file.
const WEIGHTS = [
  ['400', 'font-inter-regular'],
  ['500', 'font-inter-medium'],
  ['600', 'font-inter-semibold'],
  ['700', 'font-inter-bold'],
  ['800', 'font-inter-extrabold'],
];

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <View className="mb-3 w-1/2 pr-3">
      <View className={`h-14 rounded-input border border-line ${className}`} />
      <Text className="mt-1 font-inter-medium text-xs text-ink-2">{name}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="mb-3 font-heading text-xl tracking-heading text-ink">{title}</Text>
      <View className="flex-row flex-wrap">{children}</View>
    </View>
  );
}

const SURFACES = ['bg-bg', 'bg-surface', 'bg-surface-2', 'bg-line', 'bg-input-border'];
const TEXT = ['bg-ink', 'bg-ink-2', 'bg-muted', 'bg-muted-2'];
const BRAND = ['bg-brand', 'bg-brand-text', 'bg-brand-on', 'bg-brand-soft', 'bg-brand-line', 'bg-star-on', 'bg-star-off'];
const STATUS = [
  'bg-ok-bg', 'bg-ok-fg', 'bg-morning-bg', 'bg-morning-fg', 'bg-morning-dot', 'bg-unpaid-bg', 'bg-unpaid-fg',
  'bg-unpaid-dot', 'bg-unpaid-row', 'bg-unpaid-row-border', 'bg-locked-bg', 'bg-locked-fg',
];
const TEAMS = ['blue', 'yellow', 'red'] as const;
const LOGO = ['bg-logo-touch', 'bg-logo-pine', 'bg-logo-forest', 'bg-logo-deep'];

export default function Swatches() {
  const { mode, scheme, setMode } = useTheme();
  if (!__DEV__) return <Redirect href="/" />;

  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="p-5 pb-16">
      <Text className="font-heading text-3xl tracking-heading text-ink">Swatches</Text>
      <Text className="mb-4 mt-1 font-inter-regular text-body text-muted">
        Mode: {mode} · showing: {scheme}
      </Text>

      <View className="mb-6 flex-row gap-2">
        {MODES.map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            className={`min-h-tap min-w-tap items-center justify-center rounded-full border px-4 ${
              mode === m ? 'border-brand bg-brand-soft' : 'border-line bg-surface'
            }`}
          >
            <Text className={`font-inter-semibold text-body ${mode === m ? 'text-brand-text' : 'text-ink'}`}>{m}</Text>
          </Pressable>
        ))}
      </View>

      <Section title="Type">
        <View>
          <Text className="font-heading text-2xl tracking-heading text-ink">Heading 800 / -0.03em</Text>
          {WEIGHTS.map(([label, cls]) => (
            <Text key={label} className={`mt-1 ${cls} text-body text-ink`}>
              Inter {label}, 15px: The quick brown fox jumps over the lazy dog
            </Text>
          ))}
          <Text className="mt-1 font-inter-regular text-body-lg text-ink-2">Body large, 16px</Text>
        </View>
      </Section>

      <Section title="Gradients, shadow, radii">
        <View className="mb-3 h-24 w-full justify-center rounded-hero bg-hero px-5">
          <Text className="font-heading text-xl tracking-heading text-white">hero · radius 28</Text>
        </View>
        <View className="mb-3 h-14 w-full items-center justify-center rounded-input bg-button">
          <Text className="font-inter-bold text-body-lg text-brand-on">button · radius 16</Text>
        </View>
        <View className="mb-3 h-24 w-full rounded-card bg-grass" />
        <View className="mb-3 w-full rounded-card border border-line bg-surface p-5 shadow-card">
          <Text className="font-inter-semibold text-body text-ink">card · radius 24 · shadow</Text>
        </View>
        <View className="flex-row gap-3">
          <View className="rounded-badge bg-brand-soft px-3 py-1"><Text className="text-brand-text">badge 8</Text></View>
          <View className="rounded-nav bg-surface-2 px-3 py-1"><Text className="text-ink">nav 26</Text></View>
        </View>
      </Section>

      <Section title="Surfaces">{SURFACES.map((c) => <Swatch key={c} name={c} className={c} />)}</Section>
      <Section title="Text">{TEXT.map((c) => <Swatch key={c} name={c} className={c} />)}</Section>
      <Section title="Brand">{BRAND.map((c) => <Swatch key={c} name={c} className={c} />)}</Section>
      <Section title="Status">{STATUS.map((c) => <Swatch key={c} name={c} className={c} />)}</Section>
      <Section title="Logo">{LOGO.map((c) => <Swatch key={c} name={c} className={c} />)}</Section>

      <Section title="Teams (fill same in both themes)">
        {TEAMS.map((t) => (
          <View key={t} className="mb-3 w-full flex-row gap-3">
            {/* Full class names so Tailwind can see them at build time. */}
            <View className={{ blue: 'bg-team-blue', yellow: 'bg-team-yellow', red: 'bg-team-red' }[t] + ' h-14 flex-1 items-center justify-center rounded-input'}>
              <Text className={{ blue: 'text-team-blue-on', yellow: 'text-team-yellow-on', red: 'text-team-red-on' }[t] + ' font-inter-bold'}>{t} fill</Text>
            </View>
            <View className={{ blue: 'bg-team-blue-soft', yellow: 'bg-team-yellow-soft', red: 'bg-team-red-soft' }[t] + ' h-14 flex-1 items-center justify-center rounded-input'}>
              <Text className={{ blue: 'text-team-blue-text', yellow: 'text-team-yellow-text', red: 'text-team-red-text' }[t] + ' font-inter-bold'}>{t} text/soft</Text>
            </View>
          </View>
        ))}
      </Section>
    </ScrollView>
  );
}
