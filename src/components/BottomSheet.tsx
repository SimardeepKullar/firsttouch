import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from 'react-native';
import { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLUMN } from './layout';
import { FOCUS_RING } from './pressable';
import { ThemedSvg } from './svg';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** A grey line under the title. */
  subtitle?: string;
  children: ReactNode;
};

/** A sheet that slides up from the bottom over a dimmed page (07 Admin runs, `overlay = sheet`).
 *  Pressing the dimmed area, the Close button, or Escape / Back calls `onClose`. */
export function BottomSheet({ visible, onClose, title, subtitle, children }: Props) {
  const { bottom } = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end">
        {/* The dimmed page behind the sheet. Pressing it closes the sheet. */}
        <Pressable
          aria-label="Close"
          onPress={onClose}
          className="absolute inset-0 bg-[rgba(18,26,21,0.5)]"
        />
        <View
          role="dialog"
          aria-label={title}
          aria-modal
          className={`gap-[14px] rounded-t-[28px] bg-surface px-5 pt-[10px] ${COLUMN}`}
          style={{ paddingBottom: Math.max(28, bottom) }}
        >
          <View className="h-[5px] w-10 self-center rounded-full bg-input-border" />
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text role="heading" aria-level={2} className="font-inter-extrabold text-[22px] text-ink">
                {title}
              </Text>
              {subtitle ? <Text className="mt-[2px] text-[14px] text-muted">{subtitle}</Text> : null}
            </View>
            <Pressable
              role="button"
              aria-label="Close"
              onPress={onClose}
              className={`h-11 w-11 items-center justify-center rounded-[12px] bg-surface-2 ${FOCUS_RING}`}
            >
              <ThemedSvg width={18} height={18} viewBox="0 0 24 24" className="text-ink">
                <Path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
              </ThemedSvg>
            </Pressable>
          </View>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
