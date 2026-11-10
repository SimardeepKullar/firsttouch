// TEMPORARY test page (T-07): every display component in every variant, in the current theme.
// Dev only: outside development it just sends you home. Open http://localhost:8081/components
import { Redirect } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Avatar, AvatarStack, type AvatarSize, type AvatarTone } from '../components/Avatar';
import { AdminBadge, FlagBadge } from '../components/FlagBadge';
import { PositionTag } from '../components/PositionTag';
import { StarRating } from '../components/StarRating';
import { PublishedPill, StatusChip, type StatusChipKind, type StatusChipSize } from '../components/StatusChip';
import { useTheme, type ThemeMode } from '../lib/theme';

const MODES: ThemeMode[] = ['light', 'dark', 'system'];
const RUN_KINDS: StatusChipKind[] = ['open', 'locked', 'published', 'cancelled'];
const PASS_KINDS: StatusChipKind[] = ['paid', 'unpaid'];
const CHIP_SIZES: StatusChipSize[] = ['run', 'pass', 'row'];
const AVATAR_SIZES: AvatarSize[] = [32, 34, 36, 40, 48];
const AVATAR_TONES: AvatarTone[] = ['default', 'brand', 'muted'];

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="font-heading text-xl tracking-heading text-ink">{title}</Text>
      {note ? <Text className="mb-3 mt-1 font-inter-regular text-xs text-muted">{note}</Text> : <View className="mb-3" />}
      <View className="gap-3 rounded-card border border-line bg-surface p-4">{children}</View>
    </View>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="flex-row flex-wrap items-center gap-2">
      <Text className="w-20 font-inter-medium text-xs text-muted">{label}</Text>
      {children}
    </View>
  );
}

export default function Components() {
  const { mode, scheme, setMode } = useTheme();
  if (!__DEV__) return <Redirect href="/" />;

  return (
    <ScrollView className="flex-1 bg-page" contentContainerClassName="p-5 pb-16">
      <Text className="font-heading text-3xl tracking-heading text-ink">Components</Text>
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

      <Section title="StatusChip" note="Run states, pass states, and the 'Published' pill. Sizes: run 28, pass 30, row 24 (no dot).">
        {CHIP_SIZES.map((size) => (
          <Row key={size} label={`size ${size}`}>
            {[...RUN_KINDS, ...PASS_KINDS].map((kind) => (
              <StatusChip key={kind} kind={kind} size={size} />
            ))}
          </Row>
        ))}
        <Row label="default size">
          {[...RUN_KINDS, ...PASS_KINDS].map((kind) => (
            <StatusChip key={kind} kind={kind} />
          ))}
        </Row>
        <Row label="label prop">
          <StatusChip kind="paid" label="Indoor pass: Paid" />
          <StatusChip kind="unpaid" label="Indoor pass: Not paid" />
        </Row>
        <Row label="PublishedPill">
          <PublishedPill />
        </Row>
      </Section>

      <Section title="FlagBadge / AdminBadge" note="Morning of (amber), Unpaid (red), Admin (hero gradient, white text). Sizes: sm 20, md 22.">
        <Row label="sm (20)">
          <FlagBadge kind="morningOf" />
          <FlagBadge kind="unpaid" />
        </Row>
        <Row label="md (22)">
          <FlagBadge kind="morningOf" size="md" />
          <FlagBadge kind="unpaid" size="md" />
          <AdminBadge />
        </Row>
      </Section>

      <Section title="PositionTag" note="40 × 24, radius 8. ATT filled, DEF outlined.">
        <Row label="ATT / DEF">
          <PositionTag position="ATT" />
          <PositionTag position="DEF" />
        </Row>
      </Section>

      <Section title="Avatar" note="Initials on surface-2. Rows: tone default (ink), brand (brand-text), muted (ink-2).">
        {AVATAR_TONES.map((tone) => (
          <Row key={tone} label={tone}>
            {AVATAR_SIZES.map((size) => (
              <Avatar key={size} name="Marco Bellini" size={size} tone={tone} />
            ))}
          </Row>
        ))}
        <Row label="names">
          <Avatar name="Sim" />
          <Avatar name="Daniel Mensah" />
          <Avatar name="Mary Jane Watson" />
        </Row>
      </Section>

      <Section title="AvatarStack" note="Up to 3 avatars, then a '+n' circle (total minus 3). Sits on a surface card, so the ring blends in.">
        <Row label="3 going">
          <AvatarStack names={['Marco Bellini', 'Tomás Rivera', 'Hassan Karimi']} />
        </Row>
        <Row label="20 going">
          <AvatarStack names={['Marco Bellini', 'Tomás Rivera', 'Hassan Karimi']} total={20} />
        </Row>
        <Row label="2 going">
          <AvatarStack names={['Marco Bellini', 'Tomás Rivera']} />
        </Row>
      </Section>

      <Section title="StarRating" note="Read-only. Each row is labelled for screen readers, e.g. '4 of 5 stars'.">
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <Row key={n} label={`${n} (13 · 12)`}>
            <StarRating rating={n} />
            <StarRating rating={n} size={12} />
          </Row>
        ))}
      </Section>
    </ScrollView>
  );
}
