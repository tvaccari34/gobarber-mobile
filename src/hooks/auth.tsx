import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
//import { FiUsers } from 'react-icons/fi';
import api from '../services/api';

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthState {
    token: string;
    user: object;
}

interface AuthContextData {
    user: object;
    loading: boolean;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({children}) => {

    const [data, setData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadStorageData(): Promise<void> {
            const [[,token], [,user]] = await AsyncStorage.multiGet(['@GoBarber:token', '@GoBarber:user']);

            if (token && user) {
                setData({token, user: JSON.parse(user)});
            }

            setLoading(false);
        }

        loadStorageData();
    
    },[]);

    const signIn = useCallback( async ({email, password}) => {
        const response = await api.post('sessions', {
            email,
            password,
        });

        const { token, user } = response.data;
        await AsyncStorage.multiSet([['@GoBarber:user', JSON.stringify(user)], ['@GoBarber:token', token]]);

        setData({ token, user });

    }, []);

    const signOut = useCallback( async () => {
        await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

        setData({} as AuthState);
    }, []);

    return (

        <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>

    );

}

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

export { AuthProvider, useAuth };