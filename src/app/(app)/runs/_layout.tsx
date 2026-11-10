import { Stack } from 'expo-router';

// Runs is a Stack (like Admin), so /runs/<id> resolves to its own screen instead of falling back to Home.
export default function RunsLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />;
}
