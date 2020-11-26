import styled from 'styled-components/native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Platform } from 'react-native';

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    padding: 0 32px ${Platform.OS == 'android' ? 150 : 40}px;
    position: relative;
    padding-top: ${Platform.OS === 'ios' ? getStatusBarHeight() + 24 : 24}px;
`;

export const BackButton = styled.TouchableOpacity`
    margin-top: 40px;
`;

export const Title = styled.Text`
    font-size: 20px;
    color: #f4ede8;
    font-family: 'RobotoSlab-Medium';
    margin: 24px 0;
`;

export const UserAvatarButton = styled.TouchableOpacity`
    margin-top: 40px;
`;

export const UserAvatar = styled.Image`
    width: 186px;
    height: 186px;
    border-radius: 93px;
    margin-top: 64px;
    align-self: center;
`;

