import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import {useAuth} from '../../hooks/auth';
import api from '../../services/api';

import {Container, 
        Header, 
        HeaderTitle, 
        UserName,
        ProfileButton,
        UserAvatar,
        ProvidersList,
        ProvidersListTitle,
        ProviderContainer,
        ProviderAvatar,
        ProviderInfo,
        ProviderName,
        ProviderMeta,
        ProviderMetaText,
    } from './styles';

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

const Dashboard: React.FC = () => {

    const [providers, setProviders] = useState<Provider[]>([])

    const {user} = useAuth();

    const {navigate} = useNavigation();

    useEffect(() => {
        api.get('/providers')
            .then(response => {
                setProviders(response.data);
            })
    }, [])

    const navigateToProfile = useCallback(() => {
        navigate('Profile');
    }, [navigate]);

    const navigateToCreateAppointment = useCallback((providerId: string) => {
        navigate('CreateAppointment', {providerId});
    }, [navigate])

    return (
        <Container>
            <Header>
                <HeaderTitle>
                    Welcome, {"\n"}
                    <UserName>{user.name}</UserName>
                </HeaderTitle>
                <ProfileButton onPress={navigateToProfile}>
                    <UserAvatar source={{ uri: user.avatar_url}}></UserAvatar>
                </ProfileButton>
            </Header>

            <ProvidersList 
                data={providers}
                keyExtractor={(provider) => provider.id}
                ListHeaderComponent={
                    <ProvidersListTitle>
                        Barbers
                    </ProvidersListTitle>
                }
                renderItem={({ item: provider }) => (
                    <ProviderContainer onPress={() => navigateToCreateAppointment(provider.id)}>
                        <ProviderAvatar source={{ uri: provider.avatar_url }} />
                        <ProviderInfo>
                            <ProviderName>{provider.name}</ProviderName>
                            <ProviderMeta>
                                <Icon name='calendar' size={14} color='#ff9000' />
                                <ProviderMetaText>Monday to Friday</ProviderMetaText>
                            </ProviderMeta>
                            <ProviderMeta>
                                <Icon name='clock' size={14} color='#ff9000' />
                                <ProviderMetaText>8am to 6pm</ProviderMetaText>
                            </ProviderMeta>
                        </ProviderInfo>
                    </ProviderContainer>
                )}>

            </ProvidersList>
        </Container>
    );
}

export default Dashboard;