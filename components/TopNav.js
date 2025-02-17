import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import NotificationIcon from "./NotificationIcon";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios"; // Import axios
import { BASE_URL } from "../context/requiredIP";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TopNav = ({ navigation }) => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const route = useRoute();
    const currentTabName = route.name;

    const handleNotificationPress = () => {
        console.log("Notification Pressed");
        navigation.navigate("Notification");
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken'); // Remove token
            navigation.replace("Login"); // Redirect to login
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
    

    const styles = StyleSheet.create({
        topNav: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 120,
            paddingBottom: 10,
            backgroundColor: isDarkMode ? "#333" : "#b1e9a3",
            borderBottomWidth: 2,
            borderBottomColor: isDarkMode ? "#444" : "#A5D6A7",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 5,
            borderRadius: 18,
        },
        title: {
            fontSize: 30,
            fontWeight: "bold",
            color: isDarkMode ? "#fff" : "#000",
        },
        rightIconsContainer: {
            position: "absolute",
            top: 50,
            right: 10,
            flexDirection: "row",
            alignItems: "center",
        },
        iconButton: {
            marginLeft: 15,
        },
        themeToggleButton: {
            position: "absolute",
            top: 50,
            left: 10,
            paddingLeft: 10,
        },
    });

    return (
        <View style={styles.topNav}>
            {/* Theme toggle button */}
            <TouchableOpacity style={styles.themeToggleButton} onPress={toggleTheme}>
                {isDarkMode ? (
                    <Icon name="wb-sunny" size={28} color="#FFD700" />
                ) : (
                    <Icon name="nights-stay" size={28} color="#000" />
                )}
            </TouchableOpacity>

            {/* Title dynamically based on current tab */}
            <Text style={styles.title}>{currentTabName}</Text>

            {/* Notification & Logout icons */}
            <View style={styles.rightIconsContainer}>
                <TouchableOpacity onPress={handleNotificationPress}>
                    <NotificationIcon hasNewNotification={true} navigation={navigation} isDarkMode={isDarkMode} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={logout}>
                    <MCIcon name="logout" size={28} color={isDarkMode ? "#FFF" : "#000"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TopNav;
