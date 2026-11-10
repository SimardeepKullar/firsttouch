import { Text } from 'react-native';
import { BackLink } from '../../../../components/BackLink';
import { Screen } from '../../../../components/Screen';

// Placeholder: the real Holidays screen comes in a later ticket. Reached from Runs.
export default function AdminHolidays() {
  return (
    <Screen>
      <BackLink href="/admin/runs" label="Runs" />
      <Text role="heading" aria-level={1} className="font-inter-extrabold text-[30px] tracking-[-0.02em] text-ink">
        Holidays
      </Text>
      <Text className="text-body text-muted">Coming soon.</Text>
    </Screen>
  );
}
