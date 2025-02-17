import React, { useContext, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from '../context/ThemeContext';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "../context/requiredIP";

const NotificationItem = React.memo(({ title, message, icon, isDarkMode }) => (
  <TouchableOpacity style={[styles.notificationItem, isDarkMode && styles.notificationItemDark]}>
    <View style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}>
      <MaterialIcons name={icon} size={24} color={isDarkMode ? "#6BCB77" : "#4CAF50"} />
    </View>
    <View style={styles.textContainer}>
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>{title}</Text>
      <Text style={[styles.message, isDarkMode && styles.messageDark]}>{message}</Text>
    </View>
  </TouchableOpacity>
));

const Notification = ({ navigation }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${BASE_URL}/api/v1/users/getAllNotifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setNotifications(response.data.notifications);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      setError(error.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? "#6BCB77" : "#4CAF50"} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={28} color={isDarkMode ? "#FFFFFF" : "#333"} />
          </TouchableOpacity>
          <Text style={[styles.header, isDarkMode && styles.headerDark]}>Notifications</Text>
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={isDarkMode ? "#FF6B6B" : "#F44336"} />
          <Text style={[styles.errorText, isDarkMode && styles.errorTextDark]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (notifications.length === 0 && !loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={28} color={isDarkMode ? "#FFFFFF" : "#333"} />
          </TouchableOpacity>
          <Text style={[styles.header, isDarkMode && styles.headerDark]}>Notifications</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialIcons 
            name="notifications-none" 
            size={48} 
            color={isDarkMode ? "#6BCB77" : "#4CAF50"} 
          />
          <Text style={[styles.emptyText, isDarkMode && styles.emptyTextDark]}>
            No notifications yet
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={isDarkMode ? "#FFFFFF" : "#333"} />
        </TouchableOpacity>
        <Text style={[styles.header, isDarkMode && styles.headerDark]}>
          Notifications
        </Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <NotificationItem 
            title={item.title} 
            message={item.message} 
            icon={item.icon} 
            isDarkMode={isDarkMode} 
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    paddingTop: 40
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  backButton: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1
  },
  headerDark: {
    color: "#FFFFFF",
  },
  listContainer: {
    paddingBottom: 20
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  },
  notificationItemDark: {
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    shadowOpacity: 0.3,
  },
  iconContainer: {
    marginRight: 15,
    backgroundColor: "#e3f2fd",
    padding: 10,
    borderRadius: 50
  },
  iconContainerDark: {
    backgroundColor: "rgba(107, 203, 119, 0.1)",
  },
  textContainer: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333"
  },
  titleDark: {
    color: "#FFFFFF",
  },
  message: {
    fontSize: 14,
    color: "#555"
  },
  messageDark: {
    color: "#A0A0A0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  errorText: {
    fontSize: 16,
    color: "#555",
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  errorTextDark: {
    color: "#A0A0A0",
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  emptyTextDark: {
    color: '#A0A0A0',
  }
});

export default Notification;