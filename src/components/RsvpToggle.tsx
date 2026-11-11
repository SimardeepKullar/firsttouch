import { Pressable, Text } from 'react-native';
import { useRsvp } from '../lib/useRsvp';
import { CheckIcon, PlusIcon } from './RunIcons';
import { FOCUS_RING } from './pressable';

/** The "I'm in" button and the line that explains a refused save. It owns the useRsvp hook, so a card
 *  that doesn't draw it (a manager's) never runs the hook. */
export function RsvpToggle({ runId, going, closed }: { runId: string; going: boolean; closed: boolean }) {
  const rsvp = useRsvp(runId);

  return (
    <>
      {closed ? null : (
        <Pressable
          role="button"
          aria-pressed={going}
          aria-label={going ? "You're in" : "I'm in"}
          onPress={() => rsvp.setGoing(!going)}
          className={`h-[50px] flex-row items-center justify-center gap-[10px] rounded-input border-[1.5px] ${FOCUS_RING} ${
            going ? 'border-transparent bg-button-in shadow-button-in' : 'border-brand-line'
          }`}
        >
          {going ? <CheckIcon className="text-brand-on" strokeWidth={3} /> : <PlusIcon className="text-brand-text" strokeWidth={3} />}
          <Text className={`font-inter-extrabold text-[16px] ${going ? 'text-brand-on' : 'text-brand-text'}`}>
            {going ? 'You’re in' : 'I’m in'}
          </Text>
        </Pressable>
      )}
      {rsvp.errorMessage ? (
        <Text role="alert" className="text-center text-[14px] font-inter-semibold text-danger">
          {rsvp.errorMessage}
        </Text>
      ) : null}
    </>
  );
}
