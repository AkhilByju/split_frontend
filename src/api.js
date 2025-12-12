import axois from "axios";
import Constants from 'expo-constants';

const apiURL = Constants.expoConfig?.extra?.apiURL || "";

export const api = axois.create({
    baseURL: apiURL,
    timeout: 5000,
})

export async function joinSession({ code, displayName, isHost }) {
    if (!code || !displayName) {
        throw new Error("Session code and display name are required to join a session.");
    }

    const userResponse = await api.post(`/sessions/${code}/join`, { displayName, isHost });

    const currentUser = userResponse.data.user;

    return currentUser;
}