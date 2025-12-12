import axois from "axios";
import Constants from 'expo-constants';

const apiURL = Constants.expoConfig?.extra?.apiURL || "";

export const api = axois.create({
    baseURL: apiURL,
    timeout: 5000,
})

export async function joinSession({ code, displayName, isHost }) {
    code = code.trim();
    displayName = displayName.trim();

    if (!code || !displayName) {
        throw new Error("Session code and display name are required to join a session.");
    }

    const userResponse = await api.post(`/sessions/${code}/join`, { displayName, isHost });
    const currentUser = userResponse.data.user;

    const sessionResponse = await api.get(`/sessions/${code}`);
    const sessionData = sessionResponse.data.session;

    const usersResponse = await api.get(`/sessions/${code}/users`);
    const usersData = usersResponse.data.users;

    return {
        session: sessionData,
        currentUser,
        users: usersData
    };
}

export function formatDollars(cents) {
  if (cents == null) return '$0.00'
  return `$${(cents / 100).toFixed(2)}`
}

export async function fetchSessionBundle(code) {
    if (!code) {
        throw new Error("Session code is required to fetch session data.");
    }

    const [sessionResponse, userResponse] = await Promise.all([
        api.get(`/sessions/${code}`),
        api.get(`/sessions/${code}/users`)
    ]);

    return {
        session: sessionResponse.data.session,
        users: userResponse.data.users || []
    };
}