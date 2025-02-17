import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";

const Welcome = ({ navigation }) => {
    return (
        <ImageBackground
            source={require('../assets/background.png')} // Replace with your image path
            style={styles.backgroundImage}
            resizeMode="cover" // Ensures the image covers the entire screen
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.appName}>PrakritikCompost</Text>
                    <Text style={styles.subtitle}>Automated composting for a greener future</Text>

                    <View style={styles.howItWorks}>
                        <Text style={styles.sectionTitle}>How It Works</Text>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>1</Text>
                            <Text style={styles.stepText}>Sign up and log in to your account.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>2</Text>
                            <Text style={styles.stepText}>
                                Collect organic waste in the provided container.
                            </Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>3</Text>
                            <Text style={styles.stepText}>
                                Our IoT device automatically regulates temperature, moisture, and aeration inside the container.
                            </Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>4</Text>
                            <Text style={styles.stepText}>
                                Monitor the composting process in real-time through the app.
                            </Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>5</Text>
                            <Text style={styles.stepText}>
                                Save time and effort while producing nutrient-rich compost effortlessly.
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white overlay
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#2d6a4f", // Green compost theme
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        marginBottom: 30,
    },
    howItWorks: {
        width: "100%",
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2d6a4f",
        marginBottom: 20,
        textAlign: "center",
    },
    step: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#2d6a4f",
        color: "#fff",
        textAlign: "center",
        lineHeight: 30,
        fontWeight: "bold",
        marginRight: 10,
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: "#555",
    },
    button: {
        backgroundColor: "#2d6a4f",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Welcome;