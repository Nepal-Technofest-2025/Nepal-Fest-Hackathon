import React, { useEffect, useRef, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { ThemeContext } from '../context/ThemeContext';
import useIsVisible from '../hooks/useIsVisible';
import axios from "axios";
import { BASE_URL } from "../context/requiredIP";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Statistics = ({ navigation }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 72;

    // State for storing historical data
    const [temperatureHistory, setTemperatureHistory] = useState([]);
    const [moistureHistory, setMoistureHistory] = useState([]);
  

  // Animation values for each chart
  const chartAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // Use the useIsVisible hook for each chart
  const [ref1, isVisible1] = useIsVisible();
  const [ref2, isVisible2] = useIsVisible();
  const [ref3, isVisible3] = useIsVisible();
  const [ref4, isVisible4] = useIsVisible();

// Function to update historical data
const updateChartData = (newValue, setter, currentData, label) => {
  setter(prevData => {
    const newData = [...prevData, {
      value: newValue,
      dataPointText: `${newValue}${label}`
    }];
    // Keep only the last 5 points
    return newData.slice(-5);
  });
};

useEffect(() => {
  let ws = null;

  const connectWebSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BASE_URL}/api/v1/users/getCurrentUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = response.data.data.user._id;
      const wsUrl = BASE_URL.replace('http', 'ws');
      ws = new WebSocket(`${wsUrl}/ws?userid=${userId}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket Statistics Received:", data);
      
        // Update temperature history if new temperature data is received
        if (data.temperature !== undefined) {
          updateChartData(
            parseFloat(data.temperature),
            setTemperatureHistory,
            temperatureHistory,
            '°C'
          );
        }

        // Update moisture history if new humidity data is received
        if (data.humidity !== undefined) {
          updateChartData(
            parseFloat(data.humidity),
            setMoistureHistory,
            moistureHistory,
            '%'
          );
        }
      };
    } catch (error) {
      console.error('WebSocket Error:', error);
    }
  };

  connectWebSocket();

  return () => {
    if (ws) {
      ws.close();
    }
  };
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

  useEffect(() => {
    if (isVisible3) {
      Animated.timing(chartAnims[2], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible3]);

  useEffect(() => {
    if (isVisible4) {
      Animated.timing(chartAnims[3], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible4]);


  const pHData = [
    { value: 6.5, dataPointText: '6.5' },
    { value: 6.8, dataPointText: '6.8' },
    { value: 7.0, dataPointText: '7.0' },
    { value: 7.2, dataPointText: '7.2' },
    { value: 7.4, dataPointText: '7.4' },
  ];

  const wasteComposition = [
    { value: 40, color: '#4CAF50', label: 'Food Scraps' },
    { value: 30, color: '#FFC107', label: 'Dry Leaves' },
    { value: 20, color: '#03A9F4', label: 'Paper' },
    { value: 10, color: '#9C27B0', label: 'Other' },
  ];

// Modify the renderLineChart and renderBarChart functions to handle empty data
const renderLineChart = (index, title, data, color, isPhChart = false) => {
  const yAxisLabels = isPhChart ? Array.from({ length: 15 }, (_, i) => i.toString()) : undefined;

  // Don't render the chart if there's no data
  if (data.length === 0) {
    return (
      <Animated.View
        ref={index === 0 ? ref1 : index === 2 ? ref3 : null}
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
          <Text style={[styles.noDataText, isDarkMode && styles.noDataTextDark]}>
            Waiting for data...
          </Text>
        </View>
      </Animated.View>
    );
  }

    return (
      <Animated.View
        ref={index === 0 ? ref1 : index === 2 ? ref3 : null}
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
            data={data}
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
            maxValue={isPhChart ? 14 : Math.ceil(Math.max(...data.map(item => item.value)) * 1.2)}
            minValue={isPhChart ? 0 : undefined}
            initialSpacing={20}
            endSpacing={20}
            showDataPointOnPress
            adjustToWidth
            yAxisLabelTexts={yAxisLabels}
            rulesType="solid"
            rulesLength={chartWidth}
            noOfSections={isPhChart ? 14 : 5}
            dataPointsShape="circle"
            dataPointsWidth={6}
            verticalLinesHeight={180}
            xAxisLabelsHeight={20}
          />
        </View>
      </Animated.View>
    );
  };

  const renderBarChart = (index, title, data) => (
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
          data={data}
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

  const renderPieChart = (index, title, data) => (
    <Animated.View
      ref={ref4}
      style={[
        styles.chartBox,
        styles.pieChartBox,
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
      <View style={styles.pieChartContainer}>
        <PieChart
          data={data}
          donut
          radius={80}
          innerRadius={50}
          showValuesAsLabels={true}
          textSize={12}
          textColor={isDarkMode ? '#e5e7eb' : '#4a5568'}
          labelPosition="mid"
          textBackgroundRadius={26}
          centerLabelComponent={() => {
            return <Text style={[styles.centerLabel, isDarkMode && styles.centerLabelDark]}>Total</Text>;
          }}
        />
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={[styles.legendText, isDarkMode && styles.legendTextDark]}>
                {item.label} ({item.value}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );

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
        {/* {renderLineChart(2, 'pH Level', pHData, '#4CAF50', true)}
        {renderPieChart(3, 'Waste Composition', wasteComposition)} */}
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
  pieChartBox: {
    marginBottom: 30,
  },
  pieChartContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  legendContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#4a5568',
  },
  legendTextDark: {
    color: '#e5e7eb',
  },
  centerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
  },
  centerLabelDark: {
    color: '#000',
  },
  axisText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  axisTextDark: {
    color: '#9CA3AF',
  },
});

export default Statistics;