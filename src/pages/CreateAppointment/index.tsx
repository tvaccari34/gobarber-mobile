import { useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import {
        Container, 
        Header, 
        BackButton, 
        HeaderTitle, 
        UserAvatar,
        Content,
        ProvidersListContainer,
        ProvidersList,
        ProviderContainer,
        ProviderAvatar,
        ProviderName,        
        Calendar,
        OpenDatePickerButton,
        OpenDatePickerButtonText,
        CalendarTitle,
        Schedule,
        Section,
        SectionTitle,
        SectionContent,
        Hour,
        HourText,
        CreateAppointmentButton,
        CreateAppointmentButtonText
    } from './styles';
import { useEffect } from 'react';
import api from '../../services/api';
import { Platform, Alert } from 'react-native';

interface RouteParams{
    providerId: string;
}

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

interface AvailabilityItem {
    hour: number;
    available: boolean;
}

const CreateAppointment: React.FC = () => {
    const {user} = useAuth();
    const route = useRoute();
    const {providerId} = route.params as RouteParams;
    const {goBack, navigate} = useNavigation();

    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState(providerId);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState(0);
    const [availability, setAvailability] = useState<AvailabilityItem[]>([]);


    useEffect(() => {
        api.get('/providers')
            .then(response => {
                setProviders(response.data);
            })
    }, [])

    useEffect(() => {
        api.get(`providers/${selectedProvider}/day-availability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            }
        })
        .then(response => {
            setAvailability(response.data);
        });
    }, [selectedDate, selectedProvider]);

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

    const handleSelecteHour = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, []);

    const handleCreateAppointment = useCallback(async () => {
        try {
            const date = new Date(selectedDate);
            date.setHours(selectedHour);
            date.setMinutes(0);

            await api.post('appointments', {
                provider_id: selectedProvider,
                date,
            })

            navigate('AppointmentCreated', { date: date.getTime()});

        } catch (error) {
            Alert.alert(
                'Appointment Error',
                'An Error has been occured when trying to book the appointment. Please, try again.',
                )
        }
    }, [navigate, selectedDate, selectedHour, selectedProvider]);

    const morningAvailability = useMemo(() => {
        return availability
            .filter(({ hour }) => hour < 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                }
            });
    }, [availability]);

    const afternoonAvailability = useMemo(() => {
        return availability
            .filter(({ hour }) => hour >= 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                }
            });
    }, [availability]);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack}>
                    <Icon name="chevron-left" size={24} color="#999591"></Icon>
                </BackButton>
                <HeaderTitle>Barbers</HeaderTitle>
                <UserAvatar source={{uri: user.avatar_url}}></UserAvatar>
            </Header>
            
            <Content>
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

                <Schedule>
                    <CalendarTitle>Select a Hour</CalendarTitle>
                    <Section>
                        <SectionTitle>
                            Morning
                        </SectionTitle>
                        <SectionContent>
                            {morningAvailability.map(({hourFormatted, hour, available}) => (
                                <Hour 
                                    enabled={available}
                                    selected={selectedHour === hour}
                                    onPress={() => handleSelecteHour(hour)}
                                    available={available} 
                                    key={hourFormatted}>
                                    <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                                </Hour>
                            ))}
                        </SectionContent>
                    </Section>
                    <Section>
                        <SectionTitle>
                            Afternoon
                        </SectionTitle>
                        <SectionContent>
                            {afternoonAvailability.map(({hourFormatted, hour, available}) => (
                                <Hour
                                    enabled={available}
                                    selected={selectedHour === hour}
                                    onPress={() => handleSelecteHour(hour)}
                                    available={available} 
                                    key={hourFormatted}>
                                    <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                                </Hour>
                            ))}
                        </SectionContent>
                    </Section>
                </Schedule>
                <CreateAppointmentButton onPress={handleCreateAppointment}>
                    <CreateAppointmentButtonText>Book</CreateAppointmentButtonText>
                </CreateAppointmentButton>
            </Content>
        </Container>
    );
}

export default CreateAppointment;