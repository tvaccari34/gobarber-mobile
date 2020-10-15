import React from 'react';
import {Image, View, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {Container, 
        Title, 
        ForgotPassword, 
        ForgotPasswordText, 
        CreateAccountButton,
        CreateAccountButtonText} from './styles';

const SignIn: React.FC = () => {

    const navigation = useNavigation();

    return (
        <>
            <KeyboardAvoidingView 
                style={{flex: 1}}
                behavior={Platform.OS == 'ios' ? 'padding' : undefined}
                enabled>

                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flex: 1 }}>
                    <Container>
                        <Image source={logoImg} />
                        <View>
                            <Title>Log in</Title>
                        </View>

                        <Input name="email" icon="mail" placeholder="E-mail" />
                        <Input name="password" icon="lock" placeholder="Password" />
                        <Button onPress={() => {console.log("Entered")}}>Enter</Button>
                        <ForgotPassword onPress={() => {}}>
                            <ForgotPasswordText>Forgot Password?</ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
                <Icon name="log-in" size={20} color="#ff9000"/>
                <CreateAccountButtonText>Sign Up</CreateAccountButtonText>
            </CreateAccountButton>
        </>
    );
};

export default SignIn;