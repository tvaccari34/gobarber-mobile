import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import {
        Container,
        Title,
        Description,
        OkButton,
        OkButtonText
    } from './styles';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';

interface RouteParams {
    date: number;
}


const AppointmentCreated: React.FC = () => {

    const { reset } = useNavigation();
    const { params } = useRoute();

    const routeParams = params as RouteParams;

    const handleOkPressed = useCallback(() => {
        reset({
            routes: [
                { name: 'Dashboard' }
            ],
            index: 0
        })
    }, [reset]);

    const formattedDate = useMemo(() => {
        return format(routeParams.date, "EEEE', ' MMMM', ' dd ' of ' yyyy ' at ' HH:mm'h'");
    }, [routeParams.date,]);

    return (
        <Container>
            <Icon name="check" size={80} color="#04d361" />
            <Title>Booked successfully</Title>
            <Description>{formattedDate}</Description>

            <OkButton onPress={handleOkPressed}>
                <OkButtonText>Ok</OkButtonText>
            </OkButton>
        </Container>
    );
}

export default AppointmentCreated;