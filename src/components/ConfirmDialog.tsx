import { Modal, Pressable, Text, View } from 'react-native';
import { Button } from './Button';
import { COLUMN } from './layout';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  /** The red button, e.g. "Delete". */
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** True while the action is running: both buttons are dimmed and can't be pressed. */
  busy?: boolean;
  /** A red line under the message, e.g. when the action failed. */
  error?: string | null;
};

/** A confirmation in the middle of the screen over a dimmed page (07 Admin runs, `overlay = confirm`).
 *  Pressing Cancel, the dimmed area, or Escape / Back calls `onCancel`. */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  busy = false,
  error = null,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center px-6">
        <Pressable aria-label={cancelLabel} onPress={onCancel} className="absolute inset-0 bg-[rgba(18,26,21,0.5)]" />
        <View role="alertdialog" aria-label={title} aria-modal className={`gap-[10px] rounded-[24px] bg-surface p-[22px] ${COLUMN}`}>
          <Text role="heading" aria-level={2} className="font-inter-extrabold text-[21px] text-ink">
            {title}
          </Text>
          <Text className="text-[16px] leading-[23px] text-ink-2">{message}</Text>
          {error ? (
            <Text role="alert" className="text-[14px] text-unpaid-fg">
              {error}
            </Text>
          ) : null}
          <View className="mt-2 flex-row gap-[10px]">
            <View className="flex-1">
              <Button label={cancelLabel} onPress={onCancel} variant="secondary" size="md" disabled={busy} />
            </View>
            <View className="flex-1">
              <Button label={confirmLabel} onPress={onConfirm} variant="danger" size="md" disabled={busy} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
