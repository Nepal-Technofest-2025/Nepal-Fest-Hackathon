import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TouchableNativeFeedbackBase } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../context/requiredIP';
import axios from 'axios';

const NotificationIcon = ({ navigation, isDarkMode }) => {
    const [hasNewNotification, setHasNewNotification] = useState(false);

    // useEffect(() => {
    //     let ws = null;

    //     const connectWebSocket = async () => {

    //         try {
    //             const token = await AsyncStorage.getItem('userToken');
    //             console.log(token)
    //             const response = await axios.get(`${BASE_URL}/api/v1/users/getCurrentUser`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
                    
    //             });
            
    //             // console.log(response.data)
    //             const userId = response.data.data.user._id;


    //             const wsUrl = BASE_URL.replace('http', 'ws');

    //             ws = new WebSocket(`${wsUrl}/ws?userid=${userId}`);

    //             console.log('WebSocket Connected');

    //             ws.onmessage = (event) => {
    //                 console.log('WebSocket Message:', event.data);
    //                 // setHasNewNotification(true);
    //             };
    //         } catch (error) {
    //             console.error('WebSocket Error:', error);
    //         }
    //     };

    //     connectWebSocket();

    //     return () => {
    //         if (ws) {
    //             ws.close();
    //         }
    //     };
    // }, []);

    const handleNotificationPress = () => {
        setHasNewNotification(false);
        navigation.navigate('Notification');
    };

    return (
        <TouchableOpacity 
            style={{ position: 'relative', marginRight: 20 }} 
            onPress={handleNotificationPress}
        >
            <Icon 
                name="notifications" 
                size={30} 
                color={isDarkMode ? "#fff" : "#000"} 
            />
            {hasNewNotification && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: 'red',
                        borderWidth: 2,
                        borderColor: isDarkMode ? "#333" : "white",
                    }}
                />
            )}
        </TouchableOpacity>
    );
};

export default NotificationIcon;