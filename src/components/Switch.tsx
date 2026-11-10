import { Pressable, View } from 'react-native';
import { DISABLED_LOOK, FOCUS_RING, spaceToPress } from './pressable';

export type SwitchSize = 'normal' | 'compact';

// Whole class names so Tailwind can find them. The track is the visible part; the Pressable around it
// is at least 44 tall so it meets the tap-target rule.
const SIZES: Record<SwitchSize, { track: string; knob: string }> = {
  normal: { track: 'h-8 w-[52px]', knob: 'h-[26px] w-[26px]' },
  compact: { track: 'h-7 w-[46px]', knob: 'h-[22px] w-[22px]' },
};

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  /** Spoken name when there is no visible label to point at. */
  label?: string;
  /** `id` of the Text that names this switch (web: aria-labelledby). Use this or `label`. */
  labelledBy?: string;
  size?: SwitchSize;
  disabled?: boolean;
};

export function Switch({ value, onValueChange, label, labelledBy, size = 'normal', disabled = false }: Props) {
  const s = SIZES[size];
  const toggle = () => onValueChange(!value);
  return (
    <Pressable
      role="switch"
      aria-checked={value}
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={toggle}
      // @ts-expect-error onKeyDown exists on web only (react-native-web), not in React Native's types
      onKeyDown={spaceToPress(toggle, disabled)}
      className={`min-h-tap items-center justify-center rounded-full ${FOCUS_RING} ${disabled ? DISABLED_LOOK : ''}`}
    >
      <View
        className={`justify-center rounded-full p-[3px] ${s.track} ${value ? 'bg-button items-end' : 'bg-switch-off items-start'}`}
      >
        <View className={`rounded-full bg-white shadow-sm ${s.knob}`} />
      </View>
    </Pressable>
  );
}
