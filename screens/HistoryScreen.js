import React, { useEffect, useRef, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { ThemeContext } from '../context/ThemeContext';
import useIsVisible from '../hooks/useIsVisible';
import axios from 'axios'; // or use fetch
import { BASE_URL } from '../context/requiredIP';

const History = ({ navigation }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 72;

  // State to store fetched data
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [moistureHistory, setMoistureHistory] = useState([]);

  // Animation values for each chart
  const chartAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // Use the useIsVisible hook for each chart
  const [ref1, isVisible1] = useIsVisible();
  const [ref2, isVisible2] = useIsVisible();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/users/getAllData`);
        const data = response.data;
        console.log('API Response:', data); // Log the API response

        // Transform the data into the format expected by the charts
        if (data && Array.isArray(data.environmentDatas)) {
          const temperatureData = data.environmentDatas.map(item => ({
            value: item.temperature,
            dataPointText: `${item.temperature}°C`,
          }));
          const moistureData = data.environmentDatas.map(item => ({
            value: item.humidity,
            dataPointText: `${item.humidity}%`,
          }));

          setTemperatureHistory(temperatureData);
          setMoistureHistory(moistureData);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Trigger animations when a chart becomes visible
  useEffect(() => {
    if (isVisible1) {
      Animated.timing(chartAnims[0], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible1]);

  useEffect(() => {
    if (isVisible2) {
      Animated.timing(chartAnims[1], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible2]);

  const renderLineChart = (index, title, data, color) => {
    // Ensure data is an array before mapping
    const chartData = Array.isArray(data) ? data : [];

    // Calculate maxValue safely
    const maxValue = chartData.length > 0
      ? Math.ceil(Math.max(...chartData.map(item => item.value)) * 1.2)
      : 100; // Default max value if data is empty

    return (
      <Animated.View
        ref={index === 0 ? ref1 : null}
        style={[
          styles.chartBox,
          isDarkMode && styles.chartBoxDark,
          {
            opacity: chartAnims[index],
            transform: [
              {
                translateY: chartAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={[styles.subHeader, isDarkMode && styles.subHeaderDark]}>{title}</Text>
        <View style={styles.chartWrapper}>
          <LineChart
            data={chartData}
            color={color}
            width={chartWidth}
            height={180}
            hideDataPoints={false}
            curved
            areaChart
            yAxisOffset={0}
            xAxisOffset={20}
            rulesColor={isDarkMode ? '#374151' : '#e2e8f0'}
            yAxisThickness={1}
            xAxisThickness={1}
            yAxisTextStyle={[styles.axisText, isDarkMode && styles.axisTextDark]}
            xAxisTextStyle={[styles.axisText, isDarkMode && styles.axisTextDark]}
            dataPointsColor={color}
            startFillColor={color}
            endFillColor={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}
            startOpacity={0.3}
            endOpacity={0.1}
            spacing={50}
            maxValue={maxValue}
            initialSpacing={20}
            endSpacing={20}
            showDataPointOnPress
            adjustToWidth
            rulesType="solid"
            rulesLength={chartWidth}
            noOfSections={5}
            dataPointsShape="circle"
            dataPointsWidth={6}
            verticalLinesHeight={180}
            xAxisLabelsHeight={20}
          />
        </View>
      </Animated.View>
    );
  };

  const renderBarChart = (index, title, data) => {
    // Ensure data is an array before mapping
    const chartData = Array.isArray(data) ? data : [];

    return (
      <Animated.View
        ref={ref2}
        style={[
          styles.chartBox,
          isDarkMode && styles.chartBoxDark,
          {
            opacity: chartAnims[index],
            transform: [
              {
                translateY: chartAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={[styles.subHeader, isDarkMode && styles.subHeaderDark]}>{title}</Text>
        <View style={styles.chartWrapper}>
          <BarChart
            data={chartData}
            barWidth={30}
            frontColor="#03A9F4"
            width={chartWidth}
            height={180}
            yAxisOffset={20}
            xAxisOffset={20}
            rulesColor={isDarkMode ? '#374151' : '#e2e8f0'}
            yAxisThickness={1}
            xAxisThickness={1}
            yAxisTextStyle={[styles.axisText, isDarkMode && styles.axisTextDark]}
            xAxisTextStyle={[styles.axisText, isDarkMode && styles.axisTextDark]}
            maxValue={100}
            initialSpacing={20}
            endSpacing={20}
            spacing={40}
            hideRules
            barBorderRadius={4}
            xAxisLabelsHeight={20}
            yAxisLabelsHeight={60}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <TopNav navigation={navigation} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderLineChart(0, 'Temperature (°C)', temperatureHistory, '#FF5733')}
        {renderBarChart(1, 'Moisture Level (%)', moistureHistory)}
      </ScrollView>
      <BottomNav navigation={navigation} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(247, 255, 244, 0.95)",
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 45,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '600',
    color: '#4a5568',
  },
  subHeaderDark: {
    color: '#e5e7eb',
  },
  chartBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  chartBoxDark: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  chartWrapper: {
    marginHorizontal: -10,
  },
  axisText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  axisTextDark: {
    color: '#9CA3AF',
  },
});

export default History;