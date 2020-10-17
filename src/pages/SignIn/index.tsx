import React, {useCallback, useRef} from 'react';
import {Image, View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import {useAuth} from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErrors';


import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {Container, 
        Title, 
        ForgotPassword, 
        ForgotPasswordText, 
        CreateAccountButton,
        CreateAccountButtonText} from './styles';
import AuthRoutes from '../../routes';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const navigation = useNavigation();

    const {signIn} = useAuth();

    const handleSignIn = useCallback( async (data: SignInFormData) => {

        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail required.').email('Invalid format.'),
                password: Yup.string().required('Password required.').min(6, 'Password required.'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await signIn({
                email: data.email,
                password: data.password,
            });

            
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);

                formRef.current?.setErrors(errors);

                console.log(error);

                return;
            }

            Alert.alert(
                'Authentication Error', 
                'An error has been occured. Please check your credentials.'
            );
        }
    }, [signIn]);

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

                        <Form ref={formRef} onSubmit={handleSignIn}>
                            <Input 
                                autoCorrect={false} 
                                autoCapitalize="none"
                                keyboardType="email-address"
                                name="email" 
                                icon="mail" 
                                placeholder="E-mail"
                                returnKeyType="next" 
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}/>
                            <Input 
                                ref={passwordInputRef}
                                name="password"
                                icon="lock" 
                                placeholder="Password" 
                                secureTextEntry
                                returnKeyType="send" 
                                onSubmitEditing={() => {formRef.current?.submitForm()}}/>
                            <Button onPress={() => {formRef.current?.submitForm()}}>Enter</Button>    
                        </Form>
                        
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