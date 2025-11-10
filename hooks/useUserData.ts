
import { useState, useEffect, useCallback } from 'react';
import { UserData } from '../types';
import { storageService } from '../services/storageService';

interface UseUserDataReturn {
    userData: UserData | null;
    setUserData: (data: UserData) => void;
    loading: boolean;
}

export const useUserData = (userId?: string): UseUserDataReturn => {
    const [userData, setUserDataState] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            const data = storageService.getUserData(userId);
            setUserDataState(data);
            setLoading(false);
        } else {
            setUserDataState(null);
            setLoading(false);
        }
    }, [userId]);
    
    const setUserData = useCallback((data: UserData) => {
        if (userId) {
            setUserDataState(data);
            storageService.saveUserData(userId, data);
        }
    }, [userId]);

    return { userData, setUserData, loading };
};
