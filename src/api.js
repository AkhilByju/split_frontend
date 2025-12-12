import axois from "axios";
import Constants from 'expo-constants';

const apiURL = Constants.expoConfig?.extra?.apiURL || "";

export const api = axois.create({
    baseURL: apiURL,
    timeout: 5000,
})