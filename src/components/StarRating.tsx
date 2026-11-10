import { View } from 'react-native';
import { Path } from 'react-native-svg';
import { clampStars, MAX_STARS, starLabel } from '../lib/display';
import { ThemedSvg } from './svg';

/** Read-only stars. It draws whatever it is given: the screen decides whether the viewer may see stars at all. */
export function StarRating({ rating, size = 13 }: { rating: number; size?: 12 | 13 }) {
  const filled = clampStars(rating);
  return (
    <View role="img" aria-label={starLabel(rating)} accessible className="flex-row gap-px">
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <ThemedSvg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={i < filled ? 'text-star-on' : 'text-star-off'}
        >
          <Path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" fill="currentColor" />
        </ThemedSvg>
      ))}
    </View>
  );
}
