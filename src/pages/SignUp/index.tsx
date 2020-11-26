import React, {useRef, useCallback} from 'react';
import {Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

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

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}
    

    const handleSignUp = useCallback( async (data: SignUpFormData) => {

        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Name required.'),
                email: Yup.string().required('E-mail required.').email('Invalid format.'),
                password: Yup.string().required('Password required.').min(6, 'Minimum 6 characteres.'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await api.post('/users', data);

            Alert.alert('Registration Success', 'You alread can do the log in.');

            navigation.goBack();
            
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);

                formRef.current?.setErrors(errors);

                return;
            }

            Alert.alert('Registration Error', 'An error has been occured. Please check your details and try again.');
        }
    }, [navigation]);

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
                        <Form ref={formRef} onSubmit={handleSignUp}>
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