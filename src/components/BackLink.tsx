import { Link, type Href } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { ChevronLeftIcon } from './NavIcons';
import { FOCUS_RING } from './pressable';

/** Back link at the top of a sub-screen (11-admin-holidays): chevron plus the parent's name. */
export function BackLink({ href, label }: { href: Href; label: string }) {
  return (
    <Link href={href} asChild>
      <Pressable
        role="link"
        className={`-ml-2 min-h-tap flex-row items-center gap-[6px] self-start rounded-full pl-2 pr-[14px] ${FOCUS_RING}`}
      >
        <ChevronLeftIcon className="text-brand-text" />
        <Text className="font-inter-semibold text-[16px] text-brand-text">{label}</Text>
      </Pressable>
    </Link>
  );
}
