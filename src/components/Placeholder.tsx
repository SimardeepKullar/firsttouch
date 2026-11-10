import { Text } from 'react-native';
import { Screen } from './Screen';

/** Stand-in for a screen that a later ticket builds. */
/** `level` 2 for placeholders that sit under another page title (the admin sections). */
export function Placeholder({ title, level = 1 }: { title: string; level?: 1 | 2 }) {
  return (
    <Screen>
      <Text role="heading" aria-level={level} className="font-inter-extrabold text-[30px] tracking-[-0.02em] text-ink">
        {title}
      </Text>
      <Text className="text-body text-muted">Coming soon.</Text>
    </Screen>
  );
}
