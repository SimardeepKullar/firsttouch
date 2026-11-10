import { Platform, View, type ViewStyle } from 'react-native';

/** The Version 3 card: radius 24, `surface`, `shadow-card`, and a curved 6px bar down the left edge
 *  that follows the rounded corners (README › Curved left bar). Run cards use it now; T-38 to T-41
 *  reuse it for the team cards, so the bar fill is a prop.
 *
 *  - Web draws it the way the README does: a transparent 6px left border, then two layered
 *    backgrounds. The `surface` layer is clipped to the padding box (inside the border), the bar
 *    layer to the border box (under the border), so the bar shows through only where the border is
 *    and takes the card's rounded corners for free.
 *  - Native has no background-clip, so the bar is the card's own background and an inner `surface`
 *    view, pushed in 6px, covers all but the left edge. */
export type CardBar = 'open' | 'closed';

// Whole class names so Tailwind finds them when it scans this file.
const BAR_CLASS: Record<CardBar, string> = { open: 'bg-card-bar', closed: 'bg-card-bar-closed' };
const BAR_VAR: Record<CardBar, string> = { open: 'var(--card-bar)', closed: 'var(--card-bar-closed)' };

const CONTENT = 'gap-[14px] px-4 pb-4 pt-[18px]';

export function CardFrame({ bar = 'open', children }: { bar?: CardBar; children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    const style = {
      background: `linear-gradient(var(--surface), var(--surface)) padding-box, ${BAR_VAR[bar]} border-box`,
    } as unknown as ViewStyle;
    return (
      <View
        role="article"
        className={`rounded-card border-l-[6px] border-l-transparent shadow-card ${CONTENT}`}
        style={style}
      >
        {children}
      </View>
    );
  }
  return (
    <View role="article" className={`rounded-card shadow-card ${BAR_CLASS[bar]}`}>
      <View className={`ml-[6px] rounded-card bg-surface ${CONTENT}`}>{children}</View>
    </View>
  );
}
