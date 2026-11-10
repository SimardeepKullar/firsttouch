import { Stack } from 'expo-router';

// Admin is a Stack so Holidays can sit on top of Runs. The four sections share one
// header and pill row, in the (sections) layout; Holidays has its own screen without them.
export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
      <Stack.Screen name="(sections)" />
      <Stack.Screen name="runs/holidays" />
    </Stack>
  );
}
