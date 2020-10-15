import React from 'react';
import {Image, View, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {Container, 
        Title, 
        ForgotPassword, 
        ForgotPasswordText, 
        BackToSignIn,
        BackToSignInText} from './styles';

const SignUp: React.FC = () => {

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
                            <Title>Create Account</Title>
                        </View>

                        <Input name="name" icon="user" placeholder="User Name" />
                        <Input name="email" icon="mail" placeholder="E-mail" />
                        <Input name="password" icon="lock" placeholder="Password" />
                        <Button onPress={() => {console.log("Entered")}}>Enter</Button>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <BackToSignIn onPress={() => {}}>
                <Icon name="arrow-left" size={20} color="#ff9000"/>
                <BackToSignInText>Back</BackToSignInText>
            </BackToSignIn>
        </>
    );
};

export default SignUp;