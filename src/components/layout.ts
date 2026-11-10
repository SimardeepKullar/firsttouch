// Sizes shared by the bottom bar and the screens that scroll underneath it.
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** The design width (390). On a wide browser, content stays in a column this wide. */
export const PHONE_WIDTH = 390;
export const COLUMN = 'w-full max-w-[390px] self-center';

export const NAV_HEIGHT = 76;
const NAV_BOTTOM = 14;
/** Space between the last item on a screen and the top of the bar (the screens' 16px side padding). */
const NAV_GAP = 16;

/** Distance from the screen bottom to the bar's bottom edge: 14, or the home-indicator inset if larger. */
export function useNavBottom() {
  return Math.max(NAV_BOTTOM, useSafeAreaInsets().bottom);
}

/** Bottom padding for a scrolling screen so its last item can scroll clear of the floating bar. */
export function useNavClearance() {
  return NAV_HEIGHT + useNavBottom() + NAV_GAP;
}
