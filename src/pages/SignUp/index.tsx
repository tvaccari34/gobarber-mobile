import React, {useRef} from 'react';
import {Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {Container, 
        Title, 
        BackToSignIn,
        BackToSignInText} from './styles';

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const emailAddressInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
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
                            <Title>Create Account</Title>
                        </View>
                        <Form ref={formRef} onSubmit={(data) => {console.log(data)}}>
                            <Input 
                                autoCapitalize="words"
                                name="name" 
                                icon="user" 
                                placeholder="User Name"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    emailAddressInputRef.current?.focus();
                                }} />
                            <Input 
                                ref={emailAddressInputRef}
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
                                name="email" 
                                icon="mail" 
                                placeholder="E-mail"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }} />
                            <Input 
                                ref={passwordInputRef}
                                secureTextEntry
                                name="password" 
                                icon="lock" 
                                placeholder="Password"
                                textContentType="newPassword"
                                returnKeyType="send"
                                onSubmitEditing={() => {formRef.current?.submitForm()}} />
                            <Button onPress={() => formRef.current?.submitForm()}>Enter</Button>
                        </Form>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <BackToSignIn onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={20} color="#ff9000"/>
                <BackToSignInText>Back</BackToSignInText>
            </BackToSignIn>
        </>
    );
};

export default SignUp;