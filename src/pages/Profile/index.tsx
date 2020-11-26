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


import {
        Container, 
        BackButton,
        Title,
        UserAvatarButton,
        UserAvatar,
    } from './styles';

import { useAuth } from '../../hooks/auth';

const Profile: React.FC = () => {

    const { user, updateUser } = useAuth();

    const formRef = useRef<FormHandles>(null);
    const emailAddressInputRef = useRef<TextInput>(null);
    const oldPasswordInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const confirmPasswordInputRef = useRef<TextInput>(null);
    const navigation = useNavigation();

interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}
    

    const handleProfile = useCallback( async (data: ProfileFormData) => {

        try {

            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Name required.'),
                email: Yup.string().required('E-mail required.').email('Invalid format.'),
                old_password: Yup.string(),
                password: Yup.string().when('old_password', {
                    is: val => !!val && !!val.length,
                    then: Yup.string().required('Password required'),
                    otherwise: Yup.string(),
                }),
                password_confirmation: Yup.string().when('old_password', {
                    is: val => !!val && !!val.length,
                    then: Yup.string().required('Password confirmation required'),
                    otherwise: Yup.string(),
                })
                .oneOf([Yup.ref('password'), undefined], 'Password must match'),
            });

            const { name, email, old_password, password, password_confirmation } = data;

            //const formData = Object.assign({ name, email }, old_password && { old_password, password, password_confirmation});

            const formData = {
                name,
                email,
                ...(old_password ? {
                    old_password,
                    password,
                    password_confirmation,
                } : {}),
            }

            await schema.validate(formData, {
                abortEarly: false,
            });

            const response = await api.put('/profile', formData);

            updateUser(response.data);

            Alert.alert('Profile updated');

            navigation.goBack();
            
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);

                formRef.current?.setErrors(errors);

                return;
            }

            Alert.alert('Profile Update Error', 'An error has been occured. Please check your details and try again.');
        }
    }, [navigation]);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
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

                        <BackButton onPress={handleGoBack}>
                            <Icon name="chevron-left" size={24} color="#999591" />
                        </BackButton>

                        <UserAvatarButton>
                            <UserAvatar source={{ uri: user.avatar_url }}></UserAvatar>
                        </UserAvatarButton>
                        
                        <View>
                            <Title>My profile</Title>
                        </View>
                        <Form initialData={user} ref={formRef} onSubmit={handleProfile}>
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
                                    oldPasswordInputRef.current?.focus();
                                }} />
                            <Input 
                                ref={oldPasswordInputRef}
                                secureTextEntry
                                name="old_password" 
                                icon="lock" 
                                placeholder="Old Password"
                                containerStyle={{ marginTop: 16 }}
                                textContentType="newPassword"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }} />

                            <Input 
                                ref={passwordInputRef}
                                secureTextEntry
                                name="password" 
                                icon="lock" 
                                placeholder="New Password"
                                textContentType="newPassword"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    confirmPasswordInputRef.current?.focus();
                                }} />

                            <Input 
                                ref={confirmPasswordInputRef}
                                secureTextEntry
                                name="password_confirmation" 
                                icon="lock" 
                                placeholder="Confirm Password"
                                textContentType="newPassword"
                                returnKeyType="send"
                                onSubmitEditing={() => {formRef.current?.submitForm()}} />
                            <Button onPress={() => formRef.current?.submitForm()}>Confirm</Button>
                        </Form>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

export default Profile;