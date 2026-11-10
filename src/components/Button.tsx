import { Pressable, Text } from 'react-native';
import { DISABLED_LOOK, FOCUS_RING } from './pressable';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
/** 'lg' is 56 tall (auth screens, the README rule); 'md' is 48 tall (Create runs, Reshuffle, dialogs). */
export type ButtonSize = 'lg' | 'md';

const VARIANTS: Record<ButtonVariant, { box: string; text: string }> = {
  primary: { box: 'bg-button', text: 'text-brand-on' },
  secondary: { box: 'border-[1.5px] border-input-border bg-surface', text: 'text-ink' },
  danger: { box: 'bg-danger', text: 'text-danger-on' },
};

const SIZES: Record<ButtonSize, { box: string; text: string }> = {
  lg: { box: 'h-14 rounded-input', text: 'text-[17px] font-inter-bold' },
  md: { box: 'h-12 rounded-[14px]', text: 'text-base font-inter-extrabold' },
};

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
};

export function Button({ label, onPress, variant = 'primary', size = 'lg', disabled = false }: Props) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  return (
    <Pressable
      role="button"
      aria-label={label}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      className={`items-center justify-center px-4 ${v.box} ${s.box} ${FOCUS_RING} ${disabled ? DISABLED_LOOK : ''}`}
    >
      <Text className={`${v.text} ${s.text}`}>{label}</Text>
    </Pressable>
  );
}
