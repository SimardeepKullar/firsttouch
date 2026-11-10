import { useId, useState, type ReactNode } from 'react';
import { Pressable, Text, View, type TextInputProps } from 'react-native';
import { Path, Circle } from 'react-native-svg';
import { passwordToggleLabel } from '../lib/inputs';
import { DISABLED_LOOK, FOCUS_RING } from './pressable';
import { ThemedSvg } from './svg';
import { ThemedTextInput } from './textInput';

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  /** Small grey line under the field, e.g. "At least 8 characters". */
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoComplete?: TextInputProps['autoComplete'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  /** Something drawn inside the field on the right (the password eye). */
  trailing?: ReactNode;
  secureTextEntry?: boolean;
};

/** A 56-tall text input with a label above and an optional hint below. The parent owns `value`. */
export function TextField({
  label,
  value,
  onChangeText,
  hint,
  placeholder,
  disabled = false,
  keyboardType,
  autoComplete,
  autoCapitalize,
  trailing,
  secureTextEntry,
}: FieldProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  return (
    <View className={`gap-2 ${disabled ? DISABLED_LOOK : ''}`}>
      <Text nativeID={labelId} className="font-inter-bold text-sm text-ink">
        {label}
      </Text>
      <View>
        <ThemedTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderClassName="text-muted-2"
          editable={!disabled}
          aria-label={label}
          aria-labelledby={labelId}
          aria-describedby={hint ? hintId : undefined}
          aria-disabled={disabled}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          className={`h-14 rounded-input border-[1.5px] border-input-border bg-surface pl-4 font-inter-regular text-[17px] text-ink ${
            trailing ? 'pr-14' : 'pr-4'
          } ${FOCUS_RING}`}
        />
        {trailing}
      </View>
      {hint ? (
        <Text nativeID={hintId} className="font-inter-regular text-[13px] text-muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

type PasswordProps = Omit<FieldProps, 'trailing' | 'secureTextEntry' | 'keyboardType'>;

/** A TextField with a 44 x 44 eye button inside it. Whether the text is shown is the only state kept here. */
export function PasswordField(props: PasswordProps) {
  const [shown, setShown] = useState(false);
  const eye = (
    <Pressable
      role="button"
      aria-label={passwordToggleLabel(shown)}
      aria-disabled={props.disabled}
      disabled={props.disabled}
      onPress={() => setShown((s) => !s)}
      className={`absolute right-1.5 top-1.5 h-11 w-11 items-center justify-center rounded-input ${FOCUS_RING}`}
    >
      <ThemedSvg width={22} height={22} viewBox="0 0 24 24" className="text-muted">
        <Path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={12} cy={12} r={3} fill="none" stroke="currentColor" strokeWidth={2} />
        {/* The slash is drawn while the password is hidden, as in the mockups. */}
        {shown ? null : (
          <Path d="M3 3l18 18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        )}
      </ThemedSvg>
    </Pressable>
  );
  return <TextField {...props} secureTextEntry={!shown} autoCapitalize="none" trailing={eye} />;
}
