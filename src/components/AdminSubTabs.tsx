import { Link, usePathname } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';
import { FOCUS_RING } from './pressable';
import { ADMIN_SECTIONS, activeAdminSection } from '../lib/nav';

/** The pill row under the Admin header: Players, Runs, Team builder, Passes (06-09).
 *  It scrolls sideways on a phone too narrow to fit all four. */
export function AdminSubTabs() {
  const active = activeAdminSection(usePathname());

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      role="navigation"
      aria-label="Admin sections"
      className="grow-0"
      contentContainerClassName="gap-[6px]"
    >
      {ADMIN_SECTIONS.map((s) => {
        const isActive = s.key === active;
        return (
          <Link key={s.key} href={s.href} asChild>
            <Pressable
              role="link"
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-tap justify-center rounded-full px-[14px] ${FOCUS_RING} ${
                isActive ? 'bg-ink' : 'border border-line bg-surface'
              }`}
            >
              <Text className={`text-[14px] ${isActive ? 'font-inter-extrabold text-brand-on' : 'font-inter-bold text-ink'}`}>
                {s.label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}
