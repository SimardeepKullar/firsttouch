import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackLink } from '../components/BackLink';
import { COLUMN } from '../components/layout';
import { useAuth } from '../lib/auth';
import { mailtoHref, PRIVACY_BLOCKS, PRIVACY_TITLE, type Block, type Span } from '../lib/privacy';

// The public privacy policy. It sits outside the (app) group and is not guarded in the root
// layout, so it opens signed out and signed in. The words live in src/lib/privacy.ts.

const BODY = 'text-body leading-[22px] text-ink-2';

function Spans({ spans }: { spans: Span[] }) {
  return (
    <>
      {spans.map((s, i) => {
        if (typeof s === 'string') return s;
        if ('b' in s) {
          return (
            <Text key={i} className="font-inter-bold text-ink">
              {s.b}
            </Text>
          );
        }
        return (
          <Link key={i} href={mailtoHref(s.mailto)} className="font-inter-semibold text-brand-text underline">
            {s.mailto}
          </Link>
        );
      })}
    </>
  );
}

/** A table on a 390px phone: each row becomes a card, first cell as its title, the rest as "Heading: value". */
function TableCards({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <View className="gap-[10px]">
      {rows.map((row, r) => (
        <View key={r} className="gap-[6px] rounded-[16px] border border-line bg-surface p-[14px]">
          <Text className="font-inter-bold text-body leading-[21px] text-ink">{row[0]}</Text>
          {row.slice(1).map((cell, c) => (
            <Text key={c} className="text-[14px] leading-[20px] text-ink-2">
              <Text className="font-inter-semibold text-muted">{headers[c + 1]}: </Text>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return (
        <Text role="heading" aria-level={2} className="mt-3 font-inter-extrabold text-[20px] tracking-[-0.02em] text-ink">
          {block.text}
        </Text>
      );
    case 'p':
      return (
        <Text className={BODY}>
          <Spans spans={block.spans} />
        </Text>
      );
    case 'ul':
      return (
        <View className="gap-[6px]">
          {block.items.map((item, i) => (
            <View key={i} className="flex-row gap-2 pl-1">
              <Text className={BODY}>{'•'}</Text>
              <Text className={`flex-1 ${BODY}`}>
                <Spans spans={item} />
              </Text>
            </View>
          ))}
        </View>
      );
    case 'table':
      return <TableCards headers={block.headers} rows={block.rows} />;
  }
}

export default function Privacy() {
  const { session } = useAuth();
  const { top, bottom } = useSafeAreaInsets();
  return (
    <ScrollView
      className={`flex-1 ${COLUMN}`}
      contentContainerClassName="gap-[12px] px-4"
      contentContainerStyle={{ paddingTop: top + 16, paddingBottom: bottom + 40 }}
    >
      {/* Signed in you came from Settings; signed out you came from the sign-in screen. */}
      <BackLink href={session ? '/settings' : '/sign-in'} label={session ? 'Settings' : 'Sign in'} />
      <Text role="heading" aria-level={1} className="font-inter-extrabold text-[30px] leading-[34px] tracking-[-0.02em] text-ink">
        {PRIVACY_TITLE}
      </Text>
      {PRIVACY_BLOCKS.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </ScrollView>
  );
}
