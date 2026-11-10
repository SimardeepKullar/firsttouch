// Lets an <Svg> take a Tailwind text colour (className="text-star-on") and pass it down to
// shapes that use fill="currentColor" / stroke="currentColor". That keeps colours coming from
// the theme tokens instead of hex values in the component.
import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

export const ThemedSvg = cssInterop(Svg, {
  className: { target: 'style', nativeStyleToProp: { color: true } },
});
