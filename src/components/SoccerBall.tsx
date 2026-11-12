import { View } from 'react-native';
import { Circle, G, Path } from 'react-native-svg';
import { ThemedSvg } from './svg';

// Paths from the 03-run-detail mockup (viewBox 0 0 64 64).
const PATCHES = [
  'M32 21l10.5 7.6-4 12.4h-13l-4-12.4z',
  'M32 2.2l6.3 4.4-1.6 6.6h-9.4l-1.6-6.6z',
  'M60.3 24.6l-1.7 7.6-6.2 2.6-5.2-6.2 3.3-7.7z',
  'M50.6 55.5l-6.9 3.2-5.1-4.6 2.6-7.4h8.1z',
  'M13.4 55.5l3.4-8.8h8.1l2.6 7.4-5.1 4.6z',
  'M3.7 24.6l7.8-3.7 3.3 7.7-5.2 6.2-6.2-2.6z',
];
const SEAMS = 'M32 21v-7.8M42.5 28.6l7.4-2.5M38.5 41l5.6 5.7M25.5 41l-5.6 5.7M21.5 28.6l-7.4-2.5';

/** One colour layer of the ball. All layers are the same size and sit exactly on top of each other. */
function Layer({ size, className, children }: { size: number; className: string; children: React.ReactNode }) {
  return (
    <View className="absolute left-0 top-0">
      <ThemedSvg width={size} height={size} viewBox="0 0 64 64" className={className}>
        {children}
      </ThemedSvg>
    </View>
  );
}

/** The faint soccer ball that peeks into V3 cards (`ball-fill`, `ball-patch`, `ball-line` tokens).
 *  Three stacked SVGs, because ThemedSvg gives each SVG one theme colour. Purely decorative. */
export function SoccerBall({ size = 190 }: { size?: number }) {
  return (
    <View aria-hidden style={{ width: size, height: size, pointerEvents: 'none' }}>
      <Layer size={size} className="text-ball-fill">
        <Circle cx={32} cy={32} r={30} fill="currentColor" />
      </Layer>
      <Layer size={size} className="text-ball-patch">
        {PATCHES.map((d) => (
          <Path key={d} d={d} fill="currentColor" />
        ))}
      </Layer>
      <Layer size={size} className="text-ball-line">
        <G fill="none" stroke="currentColor" strokeWidth={0.8} strokeLinejoin="round">
          <Circle cx={32} cy={32} r={30} />
          {PATCHES.map((d) => (
            <Path key={d} d={d} />
          ))}
          <Path d={SEAMS} />
        </G>
      </Layer>
    </View>
  );
}
