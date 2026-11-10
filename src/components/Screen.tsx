import { ScrollView } from 'react-native';
import { COLUMN, useNavClearance } from './layout';

/** A scrolling tab screen: phone-width column, 16px side padding, and enough bottom padding
 *  that the last item scrolls clear of the floating bar. */
export function Screen({ children }: { children: React.ReactNode }) {
  const clearance = useNavClearance();
  return (
    <ScrollView
      className={`flex-1 ${COLUMN}`}
      contentContainerClassName="gap-[10px] px-4 pt-4"
      contentContainerStyle={{ paddingBottom: clearance }}
    >
      {children}
    </ScrollView>
  );
}
