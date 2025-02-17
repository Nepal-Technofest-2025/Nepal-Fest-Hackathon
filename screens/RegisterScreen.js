import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../context/requiredIP";

const Register = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !cPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== cPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const userData = { fullName, email, password,cPassword }; // Sending only necessary fields

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/users/register`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response.data);
      
      Alert.alert("Success", "Registration successful!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (error) {
      console.error("Registration Error:", error.response?.data?.message || error.message);
      Alert.alert("Registration Failed", error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
        <ImageBackground
          source={require('../assets/background.png')} // Replace with your image path
          style={styles.backgroundImage}
        >
    <View style={styles.container}>

      <View style={styles.card}>
      <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="account" size={22} color="#000" />
          <TextInput 
            placeholder="Full Name" 
            style={styles.input} 
            placeholderTextColor="#777"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email" size={22} color="#000" />
          <TextInput 
            placeholder="Email" 
            style={styles.input} 
            keyboardType="email-address" 
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock" size={22} color="#000" />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry={!showPassword}
            placeholderTextColor="#777"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons 
              name={showPassword ? "eye-off" : "eye"} 
              size={22} 
              color="#777" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock" size={22} color="#000" />
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor="#777"
            value={cPassword}
            onChangeText={setCPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <MaterialCommunityIcons 
              name={showConfirmPassword ? "eye-off" : "eye"} 
              size={22} 
              color="#777" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleRegister} disabled={loading}>  
          <LinearGradient colors={["#43A047", "#2E7D32"]} style={styles.button}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.toggleText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}> 
            <Text style={styles.loginText}> Login</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center", // Center the title text
    marginBottom: 30,
    marginTop:20,
  },
  card: {
    backgroundColor: "rgba(247, 255, 244, 0.95)",
    width: "100%",
    padding: 24,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(247, 255, 244, 0.95)",
    borderRadius: 8,
    paddingHorizontal: 14,
    width: "100%",
    height: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#388E3C",
    fontSize: 14,
    marginBottom: 16,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  toggleText: {
    fontSize: 14,
    color: "gray",
  },
  loginText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "bold",
  },
});

export default Register;
