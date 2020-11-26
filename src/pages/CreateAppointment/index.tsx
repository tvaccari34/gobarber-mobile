import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import {
        Container, 
        Header, 
        BackButton, 
        HeaderTitle, 
        UserAvatar,
        ProvidersListContainer,
        ProvidersList,
        ProviderContainer,
        ProviderAvatar,
        ProviderName,        
        Calendar,
        OpenDatePickerButton,
        OpenDatePickerButtonText,
        CalendarTitle
    } from './styles';
import { useEffect } from 'react';
import api from '../../services/api';
import { Platform } from 'react-native';

interface RouteParams{
    providerId: string;
}

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

const CreateAppointment: React.FC = () => {
    const {user} = useAuth();
    const route = useRoute();
    const {providerId} = route.params as RouteParams;
    const {goBack} = useNavigation();

    const [providers, setProviders] = useState<Provider[]>([]);

    const [selectedProvider, setSelectedProvider] = useState(providerId);

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        api.get('/providers')
            .then(response => {
                setProviders(response.data);
            })
    }, [])

    const navigateBack = useCallback(() => {
        goBack();
    }, [goBack]);

    const handleSelecteProvider = useCallback((selectedProviderId: string) => {
        setSelectedProvider(selectedProviderId);

    },[]);

    const handleToggleDatePicker = useCallback(() => {
        setShowDatePicker((state) => !state);
    },[],);

    const handleDateChanged = useCallback((event: any, date: Date | undefined) => {

        if(Platform.OS === 'android'){
            setShowDatePicker(false);
        }

        if (date) {
            setSelectedDate(date);    
        }

    }, []);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack}>
                    <Icon name="chevron-left" size={24} color="#999591"></Icon>
                </BackButton>
                <HeaderTitle>Barbers</HeaderTitle>
                <UserAvatar source={{uri: user.avatar_url}}></UserAvatar>
            </Header>
            <ProvidersListContainer>
                <ProvidersList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={providers}
                    keyExtractor={(provider) => provider.id}
                    renderItem={({item: provider}) => (
                        <ProviderContainer
                            onPress={() => handleSelecteProvider(provider.id)}
                            selected={provider.id === selectedProvider}
                        >
                            <ProviderAvatar source={{uri: provider.avatar_url}}></ProviderAvatar>
                            <ProviderName selected={provider.id === selectedProvider}>{provider.name}</ProviderName>
                        </ProviderContainer>
                    )}>
                </ProvidersList>
            </ProvidersListContainer>

            <Calendar>
                <CalendarTitle>Date</CalendarTitle>
                <OpenDatePickerButton onPress={handleToggleDatePicker}>
                    <OpenDatePickerButtonText>Select another date</OpenDatePickerButtonText>
                </OpenDatePickerButton>
                {showDatePicker && (<DateTimePicker 
                    mode="date"
                    display="calendar"
                    onChange={handleDateChanged}
                    textColor="#f4ede8"
                    value={selectedDate}
                >
                </DateTimePicker>)}
            </Calendar>
        </Container>
    );
}

export default CreateAppointment;