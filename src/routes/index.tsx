import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import {useAuth} from '../hooks/auth';
import Animated from 'react-native-reanimated';

const Routes: React.FC = () => {

    const {user, loading} = useAuth();

    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center'}}>
                    <ActivityIndicator size="large" color="999" />
                </View>
    }

    return user ? <AppRoutes /> : <AuthRoutes />
};

export default Routes;