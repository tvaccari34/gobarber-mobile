import React, { useCallback } from 'react';
import {
        Container,
        Title,
        Description,
        OkButton,
        OkButtonText
    } from './styles';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';


const AppointmentCreated: React.FC = () => {

    const { reset } = useNavigation();

    const handleOkPressed = useCallback(() => {
        reset({
            routes: [
                { name: 'Dashboard' }
            ],
            index: 0
        })
    }, [reset]);

    return (
        <Container>
            <Icon name="check" size={80} color="#04d361" />
            <Title>Booked successfully</Title>
            <Description>November, 26 at 17:00</Description>

            <OkButton onPress={handleOkPressed}>
                <OkButtonText>Ok</OkButtonText>
            </OkButton>
        </Container>
    );
}

export default AppointmentCreated;