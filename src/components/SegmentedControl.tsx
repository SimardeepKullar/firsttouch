import { Pressable, Text, View } from 'react-native';
import { DISABLED_LOOK, FOCUS_RING, spaceToPress } from './pressable';

/** 'toggle': a row of buttons, each reporting pressed state (04 Table/Field).
 *  'radio': a radio group, one option selected (05 Appearance). */
export type SegmentedKind = 'toggle' | 'radio';
/** 'md' is 44 tall (04 Teams); 'lg' is 48 tall with a rounder track (05 Appearance). */
export type SegmentedSize = 'md' | 'lg';

const SIZES: Record<SegmentedSize, { track: string; segment: string }> = {
  md: { track: 'rounded-full', segment: 'h-11 rounded-full' },
  lg: { track: 'rounded-[18px]', segment: 'h-12 rounded-[14px]' },
};

export type SegmentedOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Names the group, e.g. "View" or "Appearance". */
  label: string;
  kind?: SegmentedKind;
  size?: SegmentedSize;
  disabled?: boolean;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  kind = 'toggle',
  size = 'md',
  disabled = false,
}: Props<T>) {
  const s = SIZES[size];
  const radio = kind === 'radio';
  return (
    <View
      role={radio ? 'radiogroup' : 'group'}
      aria-label={label}
      className={`flex-row gap-1 border border-line bg-surface p-1 ${s.track} ${disabled ? DISABLED_LOOK : ''}`}
    >
      {options.map((o) => {
        const selected = o.value === value;
        const press = () => onChange(o.value);
        return (
          <Pressable
            key={o.value}
            role={radio ? 'radio' : 'button'}
            aria-checked={radio ? selected : undefined}
            aria-pressed={radio ? undefined : selected}
            aria-disabled={disabled}
            disabled={disabled}
            onPress={press}
            // Only radios need this; on web Pressable already does Space for role="button".
            // @ts-expect-error onKeyDown exists on web only (react-native-web), not in React Native's types
            onKeyDown={radio ? spaceToPress(press, disabled) : undefined}
            className={`min-h-tap flex-1 items-center justify-center ${FOCUS_RING} ${s.segment} ${selected ? 'bg-button' : ''}`}
          >
            <Text className={`font-inter-bold text-[15px] ${selected ? 'text-brand-on' : 'text-muted'}`}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
