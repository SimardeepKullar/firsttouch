import { Pressable, View } from 'react-native';
import { Path } from 'react-native-svg';
import { clampStars } from '../lib/display';
import { isStarFilled, setStarsLabel, STAR_VALUES } from '../lib/inputs';
import { DISABLED_LOOK, FOCUS_RING } from './pressable';
import { ThemedSvg } from './svg';

type Props = {
  /** Current rating, 1-5 (0 draws all stars empty). */
  value: number;
  onChange: (stars: number) => void;
  /** Names the group, e.g. "Rating for Sim". */
  label: string;
  disabled?: boolean;
};

/** The editable version of StarRating: five 40 x 44 buttons with 26 px stars. */
export function StarPicker({ value, onChange, label, disabled = false }: Props) {
  const current = clampStars(value);
  return (
    <View role="group" aria-label={label} className={`flex-row ${disabled ? DISABLED_LOOK : ''}`}>
      {STAR_VALUES.map((n) => {
        const filled = isStarFilled(n, value);
        return (
          <Pressable
            key={n}
            role="button"
            aria-label={setStarsLabel(n)}
            aria-pressed={n === current}
            aria-disabled={disabled}
            disabled={disabled}
            onPress={() => onChange(n)}
            className={`h-11 w-10 items-center justify-center rounded-lg ${FOCUS_RING}`}
          >
            <ThemedSvg width={26} height={26} viewBox="0 0 24 24" className={filled ? 'text-brand' : 'text-muted-2'}>
              <Path
                d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </ThemedSvg>
          </Pressable>
        );
      })}
    </View>
  );
}
