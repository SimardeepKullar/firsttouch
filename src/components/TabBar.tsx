import { Link, usePathname } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { TAB_ICONS } from './NavIcons';
import { COLUMN, NAV_HEIGHT, useNavBottom } from './layout';
import { FOCUS_RING } from './pressable';
import { activeTab, tabsFor } from '../lib/nav';

/** The floating bottom bar (02-home, 04-teams): 76 tall, radius 26, inset 12 from the sides and
 *  14 from the bottom. Each tab is a link, so on web it is a real <a> with aria-current="page". */
export function TabBar({ isAdmin }: { isAdmin: boolean }) {
  const active = activeTab(usePathname());
  const bottom = useNavBottom();

  return (
    // Full-width strip that ignores touches, so only the bar itself is tappable.
    <View pointerEvents="box-none" className="absolute inset-x-0 bottom-0" style={{ paddingBottom: bottom }}>
      <View pointerEvents="box-none" className={`px-3 ${COLUMN}`}>
        <View
          role="navigation"
          aria-label="Main"
          className="flex-row rounded-nav border border-line bg-nav px-2 py-1.5 shadow-card"
          style={{ height: NAV_HEIGHT }}
        >
          {tabsFor(isAdmin).map((tab) => {
            const isActive = tab.name === active;
            const Icon = TAB_ICONS[tab.name];
            const color = isActive ? 'text-brand-text' : 'text-muted';
            return (
              <Link key={tab.name} href={tab.href} asChild>
                <Pressable
                  role="link"
                  aria-current={isActive ? 'page' : undefined}
                  className={`min-h-tap flex-1 items-center justify-center gap-[3px] rounded-2xl ${FOCUS_RING}`}
                >
                  <Icon className={color} />
                  <Text className={`text-[12px] ${color} ${isActive ? 'font-inter-bold' : 'font-inter-semibold'}`}>
                    {tab.label}
                  </Text>
                  {/* The underline; an empty spacer on inactive tabs keeps every tab the same height. */}
                  <View className={`h-[3px] w-[22px] rounded-[2px] ${isActive ? 'bg-brand' : ''}`} />
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>
    </View>
  );
}
