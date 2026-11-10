// A TextInput that takes the placeholder colour from a Tailwind text colour:
// <ThemedTextInput placeholderClassName="text-muted-2" />. Same idea as ThemedSvg in svg.ts.
import { cssInterop } from 'nativewind';
import { TextInput } from 'react-native';

export const ThemedTextInput = cssInterop(TextInput, {
  className: 'style',
  placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } },
}) as typeof TextInput & React.ComponentType<React.ComponentProps<typeof TextInput> & { placeholderClassName?: string }>;
