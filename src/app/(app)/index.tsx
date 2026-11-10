import { Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { useMe } from '../../lib/useMe';

// Placeholder: the real Home comes in a later ticket.
export default function Home() {
  const me = useMe();
  return (
    <Screen>
      <Text role="heading" aria-level={1} className="font-inter-extrabold text-[30px] tracking-[-0.02em] text-ink">
        {`Hi, ${me.data?.name ?? ''}`}
      </Text>
      <Text className="text-body text-muted">Coming soon.</Text>
    </Screen>
  );
}
