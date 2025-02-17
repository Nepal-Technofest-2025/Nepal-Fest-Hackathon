import React, { useState, useRef, useMemo, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext'; // Updated import path

const BottomNav = ({ navigation }) => {
    const animatedValue = useRef(new Animated.Value(1)).current;
    const { isDarkMode } = useContext(ThemeContext); // Now using the correct ThemeContext

    // Reversed order: Statistics on the left, Home on the right
    const navItems = useMemo(() => [
        { name: 'Dashboard', icon: 'home' },
        { name: 'Statistics', icon: 'bar-chart' },
        { name: 'History', icon: 'history' },
    ], []);

    const [selectedNavItem, setSelectedNavItem] = useState(navItems[0].name);

    useFocusEffect(
        React.useCallback(() => {
            const currentRoute = navigation.getState().routes[navigation.getState().index]?.name;
            setSelectedNavItem(currentRoute);
        }, [navigation])
    );

    const handleNavItemPress = (name) => {
        if (selectedNavItem === name) return;
        setSelectedNavItem(name);

        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 0.9,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();

        navigation.navigate(name);
    };

    const styles = StyleSheet.create({
        navWrapper: {
            position: 'absolute',
            bottom: 1,
            left: 0,
            right: 0,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDarkMode ? 'rgba(40, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 5,
        },
        bottomNav: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: isDarkMode ? '#2C2C2C' : '#ffffff',
            borderRadius: 10,
            borderTopWidth: 0.8,
            borderLeftWidth: 0.8,
            borderRightWidth: 0.8,
            borderColor: isDarkMode ? '#444' : '#d1d1d1',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 5,
        },
        navItem: {
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 5,
        },
        selectedNavItem: {
            backgroundColor: isDarkMode ? '#444' : '#E5E5E9',
            borderRadius: 12,
            paddingHorizontal: 18,
            paddingVertical: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 10,
        },
        navIcon: {
            marginBottom: 2,
        },
        navText: {
            fontSize: 11,
            fontWeight: '500',
            color: isDarkMode ? '#FFFFFF' : '#333333',
        },
    });

    return (
        <View style={styles.navWrapper}>
            <View style={styles.bottomNav}>
                {navItems.map((item) => (
                    <TouchableOpacity
                        key={item.name}
                        style={[styles.navItem, selectedNavItem === item.name && styles.selectedNavItem]}
                        onPress={() => handleNavItemPress(item.name)}
                        activeOpacity={0.7}
                    >
                        <Animated.View style={{ transform: [{ scale: selectedNavItem === item.name ? animatedValue : 1 }] }}>
                            <Icon
                                name={item.icon}
                                size={26}
                                color={selectedNavItem === item.name ? (isDarkMode ? '#FFFFFF' : '#333333') : (isDarkMode ? '#8F8F8F' : '#8F8F8F')}
                                style={styles.navIcon}
                            />
                        </Animated.View>
                        <Text style={[styles.navText, { color: selectedNavItem === item.name ? (isDarkMode ? '#FFFFFF' : '#333333') : (isDarkMode ? '#8F8F8F' : '#8F8F8F') }]}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default BottomNav;