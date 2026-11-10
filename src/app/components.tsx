// TEMPORARY test page (T-07): every display component in every variant, in the current theme.
// Dev only: outside development it just sends you home. Open http://localhost:8081/components
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Button, type ButtonSize, type ButtonVariant } from '../components/Button';
import { Avatar, AvatarStack, type AvatarSize, type AvatarTone } from '../components/Avatar';
import { AdminBadge, FlagBadge } from '../components/FlagBadge';
import { PositionTag } from '../components/PositionTag';
import { SegmentedControl } from '../components/SegmentedControl';
import { StarPicker } from '../components/StarPicker';
import { Switch } from '../components/Switch';
import { PasswordField, TextField } from '../components/TextField';
import { StarRating } from '../components/StarRating';
import { PublishedPill, StatusChip, type StatusChipKind, type StatusChipSize } from '../components/StatusChip';
import { useTheme, type ThemeMode } from '../lib/theme';

const BUTTON_VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'danger'];
const BUTTON_SIZES: ButtonSize[] = ['lg', 'md'];
const VIEW_OPTIONS = [
  { value: 'table', label: 'Table' },
  { value: 'field', label: 'Field' },
] as const;
const APPEARANCE_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;

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

/** T-08: every input control, controlled by local state so you can click through the states. */
function Inputs() {
  const [on, setOn] = useState(true);
  const [plays, setPlays] = useState(true);
  const [view, setView] = useState<'table' | 'field'>('table');
  const [look, setLook] = useState<'light' | 'dark' | 'system'>('light');
  const [stars, setStars] = useState(3);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('footy2027');
  const [pressed, setPressed] = useState('(nothing yet)');
  const press = (what: string) => () => setPressed(what);

  return (
    <>
      <Text className="mb-1 font-heading text-2xl tracking-heading text-ink">Inputs (T-08)</Text>
      <Text className="mb-4 font-inter-regular text-xs text-muted">Last button pressed: {pressed}</Text>

      <Section title="Switch" note="52 x 32 (compact 46 x 28), 44 tall tap area. Space or Enter toggles. Last two are disabled.">
        <Row label="normal">
          <Switch value={on} onValueChange={setOn} label="Night-before reminder" />
          <Text className="font-inter-regular text-xs text-ink">{on ? 'on' : 'off'}</Text>
        </Row>
        <Row label="compact">
          <Switch value={plays} onValueChange={setPlays} size="compact" label="Plays" />
          <Text className="font-inter-regular text-xs text-ink">{plays ? 'on' : 'off'}</Text>
        </Row>
        <Row label="disabled">
          <Switch value onValueChange={() => {}} label="Disabled on" disabled />
          <Switch value={false} onValueChange={() => {}} label="Disabled off" disabled />
          <Switch value size="compact" onValueChange={() => {}} label="Disabled compact" disabled />
        </Row>
      </Section>

      <Section title="SegmentedControl" note="toggle = buttons that report pressed (aria-pressed). radio = radio group (aria-checked). Sizes md 44, lg 48.">
        <Row label="toggle md">
          <View className="w-64">
            <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} label="View" />
          </View>
          <Text className="font-inter-regular text-xs text-ink">{view}</Text>
        </Row>
        <Row label="radio lg">
          <View className="w-72">
            <SegmentedControl options={APPEARANCE_OPTIONS} value={look} onChange={setLook} label="Appearance" kind="radio" size="lg" />
          </View>
          <Text className="font-inter-regular text-xs text-ink">{look}</Text>
        </Row>
        <Row label="disabled">
          <View className="w-64">
            <SegmentedControl options={VIEW_OPTIONS} value="field" onChange={() => {}} label="View (disabled)" disabled />
          </View>
        </Row>
      </Section>

      <Section title="StarPicker" note="Five 40 x 44 buttons, 26 px stars, each 'Set N stars'. Disabled = dimmed (Plays off).">
        <Row label="editable">
          <StarPicker value={stars} onChange={setStars} label="Rating for Sim" />
          <Text className="font-inter-regular text-xs text-ink">{stars}</Text>
        </Row>
        <Row label="empty">
          <StarPicker value={0} onChange={() => {}} label="Rating (empty)" />
        </Row>
        <Row label="disabled">
          <StarPicker value={4} onChange={() => {}} label="Rating (disabled)" disabled />
        </Row>
      </Section>

      <Section title="TextField / PasswordField" note="56 tall, radius 16, label above, hint below. The eye button shows / hides the password.">
        <TextField label="Name" value={name} onChangeText={setName} placeholder="First and last name" autoComplete="name" />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          hint="We only use this to sign you in"
        />
        <PasswordField label="Password" value={pass} onChangeText={setPass} hint="At least 8 characters" autoComplete="current-password" />
        <TextField label="Disabled" value="Can't edit this" onChangeText={() => {}} disabled />
        <PasswordField label="Disabled password" value="secret" onChangeText={() => {}} disabled />
      </Section>

      <Section title="Button" note="Sizes: lg 56 (auth screens), md 48. Disabled = dimmed and not pressable.">
        {BUTTON_SIZES.map((size) =>
          BUTTON_VARIANTS.map((variant) => (
            <View key={`${size}-${variant}`} className="gap-2">
              <Button label={`${variant} ${size}`} variant={variant} size={size} onPress={press(`${variant} ${size}`)} />
              <Button label={`${variant} ${size} disabled`} variant={variant} size={size} onPress={press('DISABLED (should never show)')} disabled />
            </View>
          )),
        )}
      </Section>
    </>
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
            role="button"
            aria-pressed={mode === m}
            onPress={() => setMode(m)}
            className={`min-h-tap min-w-tap items-center justify-center rounded-full border px-4 ${
              mode === m ? 'border-brand bg-brand-soft' : 'border-line bg-surface'
            }`}
          >
            <Text className={`font-inter-semibold text-body ${mode === m ? 'text-brand-text' : 'text-ink'}`}>{m}</Text>
          </Pressable>
        ))}
      </View>

      <Inputs />

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
