import { Platform, Pressable, Text } from 'react-native';
import { GoogleG } from './GoogleG';
import { FOCUS_RING } from './pressable';

// "Continue with Google", following Google's branding rules (developers.google.com/identity/branding-guidelines):
//   light theme: #FFFFFF fill, 1px #747775 border, #1F1F1F text
//   dark theme:  #131314 fill, 1px #8E918F border, #E3E3E3 text
// Those hex values are Google's, so they are hard-coded on purpose. Size (56 tall, 16 radius)
// and the Inter label follow our design instead. Google's padding: Android/web 12 before the G,
// 10 after it; iOS 16 before, 12 after.
const IOS = Platform.OS === 'ios';

export function GoogleButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      role="button"
      aria-label="Continue with Google"
      onPress={onPress}
      style={{ paddingHorizontal: IOS ? 16 : 12, gap: IOS ? 12 : 10 }}
      className={`h-14 flex-row items-center justify-center rounded-input border border-[#747775] bg-white active:opacity-80 dark:border-[#8E918F] dark:bg-[#131314] ${FOCUS_RING}`}
    >
      <GoogleG size={24} />
      <Text className="font-inter-semibold text-[17px] text-[#1F1F1F] dark:text-[#E3E3E3]">Continue with Google</Text>
    </Pressable>
  );
}
