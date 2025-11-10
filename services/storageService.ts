import { User, UserData } from '../types';
import { MOCK_USERS, MOCK_USER_DATA } from '../data/mock';

const USERS_KEY = 'one-orbit-users';
const USER_DATA_PREFIX = 'one-orbit-userdata-';

const getUsers = (): User[] => {
    try {
        const usersJson = localStorage.getItem(USERS_KEY);
        if (usersJson) {
            return JSON.parse(usersJson);
        }
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
    }
    // If nothing in storage, initialize with mock data
    localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
};

const saveUsers = (users: User[]): void => {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
};

const getUserData = (userId: string): UserData => {
    try {
        const dataJson = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
        if (dataJson) {
            const data = JSON.parse(dataJson);
            // Backward compatibility for users without the new fields
            if (!data.trioMembers) {
                data.trioMembers = [];
            }
            if (!data.checkIns) {
                data.checkIns = [];
            }
            return data;
        }
    } catch (error) {
        console.error(`Failed to parse user data for ${userId}`, error);
    }
    // If no data for this user, initialize with mock data
    const mockData = MOCK_USER_DATA[userId] || MOCK_USER_DATA['1'];
    saveUserData(userId, mockData);
    return mockData;
};

const saveUserData = (userId: string, data: UserData): void => {
    try {
        localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save user data for ${userId}`, error);
    }
};

const initializeUserData = (userId: string): void => {
    const defaultData = MOCK_USER_DATA['new'] || MOCK_USER_DATA['1']; // fallback
    saveUserData(userId, defaultData);
};


export const storageService = {
    getUsers,
    saveUsers,
    getUserData,
    saveUserData,
    initializeUserData,
};