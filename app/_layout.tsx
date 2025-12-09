import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ headerTitle: "Split" }} />
    <Stack.Screen name="joinBill" options={{ headerTitle: "Join Bill" }} />
    <Stack.Screen name="createBill" options={{ headerTitle: "Create Bill" }} />
  </Stack>;
}
