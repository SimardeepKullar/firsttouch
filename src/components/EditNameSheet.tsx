import { useState } from 'react';
import { Text } from 'react-native';
import { validateName } from '../lib/settings';
import { useUpdateName } from '../lib/useSettings';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { TextField } from './TextField';

type Props = {
  /** The name shown in the field when the sheet opens. */
  currentName: string;
  onClose: () => void;
};

/** The "Edit name" sheet. Mount it when you want it open and unmount it to close, so each opening
 *  starts fresh with the current name and no old error. */
export function EditNameSheet({ currentName, onClose }: Props) {
  const [text, setText] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const update = useUpdateName();

  function save() {
    const check = validateName(text);
    if (!check.ok) {
      setError(check.message);
      return;
    }
    setError(null);
    update.mutate(check.name, { onSuccess: onClose });
  }

  return (
    <BottomSheet visible onClose={onClose} title="Edit name" subtitle="This is the name other players see.">
      <TextField
        label="Name"
        value={text}
        onChangeText={(next) => {
          setText(next);
          setError(null);
        }}
        autoCapitalize="words"
        autoComplete="name"
      />
      {error ? (
        <Text role="alert" className="text-[13px] text-unpaid-fg">
          {error}
        </Text>
      ) : null}
      {update.isError ? (
        <Text role="alert" className="text-[13px] text-unpaid-fg">
          Couldn’t save your name. Please try again.
        </Text>
      ) : null}
      <Button label={update.isPending ? 'Saving…' : 'Save name'} onPress={save} disabled={update.isPending} />
    </BottomSheet>
  );
}
