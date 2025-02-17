import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./context/ThemeContext"; // Import the ThemeProvider
import TopNav from "./components/TopNav";
// import BottomNav from "./components/BottomNav";
import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";
import Statistics from "./screens/StatisticsScreen";
import Dashboard from "./screens/HomeScreen";
import Notification from "./screens/NotificationScreen";
import Welcome from "./screens/WelcomeScreen";
import History from "./screens/HistoryScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <ThemeProvider >
          
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        header: (props) => <TopNav {...props} />,
                        headerShown: false,
                        ...TransitionPresets.SlideFromRightIOS,
                    }}
                >
                    <Stack.Screen name="Welcome" component={Welcome}/>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                    <Stack.Screen name="Statistics" component={Statistics} />
                    <Stack.Screen name="Notification" component={Notification} />
                    <Stack.Screen name="History" component={History} />
                    
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
}