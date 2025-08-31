# 🔌 AI-Powered IoT Carbon Intensity Monitoring Guide

## 🎯 **Overview**

The GreenChain platform now includes an **AI-Powered IoT Simulation System** that continuously monitors carbon intensity across hydrogen production facilities. This system provides real-time insights into which companies are using less carbon and helps identify best practices for environmental sustainability.

## 🧠 **How It Works**

### **1. AI Data Generation**
- **Realistic Simulation**: Creates synthetic data that mimics real hydrogen production scenarios
- **Facility Types**: Different facility configurations (solar-heavy, wind-heavy, mixed-energy, grid-dependent)
- **Environmental Factors**: Weather patterns, time-of-day, seasonal variations
- **AI Insights**: Machine learning algorithms detect anomalies and predict trends

### **2. Carbon Intensity Calculation**
```
Carbon Intensity = (Grid Energy × Grid CO2 Factor + Renewable Energy × Renewable CO2 Factor) ÷ Efficiency

Where:
- Grid CO2 Factor = 0.5 kg CO2/kWh
- Renewable CO2 Factor = 0.02 kg CO2/kWh
- Efficiency = 65-80% (varies by facility)
```

### **3. Environmental Scoring**
- **Base Score**: Renewable energy percentage (0-100)
- **Carbon Bonus**: +15 for very low, +10 for low, +5 for moderate carbon intensity
- **Efficiency Bonus**: +10 for ≥80%, +5 for ≥70% efficiency
- **Anomaly Penalty**: -10 for detected anomalies

## 🏭 **Facility Types & Performance**

### **Solar-Heavy Facilities** (GreenTech Mumbai, SolarTech Bangalore)
- **Base Carbon Intensity**: 0.4-0.5 kg CO2/kg H2
- **Renewable Usage**: 80-85%
- **Peak Performance**: 6 AM - 6 PM (daylight hours)
- **Environmental Score**: 85-95

### **Wind-Heavy Facilities** (CleanEnergy Gujarat)
- **Base Carbon Intensity**: 0.3-0.4 kg CO2/kg H2
- **Renewable Usage**: 85-90%
- **Consistent Performance**: 24/7 operation
- **Environmental Score**: 90-98

### **Mixed-Energy Facilities** (HydroCorp Chennai)
- **Base Carbon Intensity**: 1.0-1.5 kg CO2/kg H2
- **Renewable Usage**: 55-65%
- **Balanced Approach**: Combines solar, wind, and grid
- **Environmental Score**: 70-80

### **Grid-Dependent Facilities** (EcoFuel Industries)
- **Base Carbon Intensity**: 2.0-3.0 kg CO2/kg H2
- **Renewable Usage**: 25-35%
- **High Carbon Footprint**: Relies heavily on grid power
- **Environmental Score**: 40-60

## 📊 **Real-Time Monitoring Features**

### **1. Live Dashboard**
- **System Status**: Active/stopped simulation status
- **Facility Count**: Total number of monitored facilities
- **Environmental Score**: Average across all facilities
- **Anomaly Detection**: Real-time alerts for unusual patterns

### **2. Facility Comparison**
- **Performance Ranking**: Facilities ranked by environmental score
- **Carbon Intensity**: Real-time CO2 emissions per kg H2
- **Renewable Percentage**: Current renewable energy usage
- **Efficiency Metrics**: Production efficiency ratings

### **3. AI Insights**
- **Trend Analysis**: Improving vs. declining performance
- **Anomaly Detection**: Unusual carbon intensity patterns
- **Predictive Analytics**: Expected performance based on historical data
- **Efficiency Ratings**: Excellent, good, average, below average

## 🚨 **Anomaly Detection System**

### **What Triggers Alerts**
- **Carbon Intensity Spikes**: Sudden increases above normal range
- **Efficiency Drops**: Unexpected decreases in production efficiency
- **Renewable Usage Changes**: Significant drops in renewable energy usage
- **Weather Anomalies**: Unusual weather patterns affecting production

### **Alert Severity Levels**
- **High Severity**: Carbon intensity >2x normal, efficiency <50%
- **Medium Severity**: Carbon intensity 1.5-2x normal, efficiency 50-70%

### **Alert Information**
- **Facility Details**: Name, type, current metrics
- **Expected vs. Actual**: Comparison with normal ranges
- **Anomaly Score**: 0-1 scale indicating severity
- **Timestamp**: When the anomaly was detected

## 📈 **Analytics & Reporting**

### **1. Carbon Intensity Analytics**
- **Overall Averages**: System-wide carbon intensity trends
- **Facility Breakdown**: Individual facility performance
- **Classification Distribution**: Very low, low, moderate, high, very high
- **Historical Trends**: 24-hour, weekly, monthly patterns

### **2. Renewable Energy Analytics**
- **Usage Distribution**: Excellent (≥80%), good (60-79%), moderate (40-59%), poor (<40%)
- **Top Performers**: Top 3 facilities by renewable usage
- **Performance Correlation**: Relationship between renewable usage and carbon intensity

### **3. Efficiency Analytics**
- **Efficiency Ratings**: Distribution across performance levels
- **Trend Analysis**: Improving vs. declining efficiency patterns
- **Maintenance Insights**: Correlation between efficiency and facility age

## 🎮 **Interactive Features**

### **1. Simulation Control**
- **Start/Stop**: Control the IoT simulation
- **Interval Adjustment**: Modify data generation frequency (15s, 30s, 60s)
- **Emergency Scenarios**: Simulate crisis situations for testing

### **2. Real-Time Updates**
- **Auto-refresh**: Dashboard updates every 30 seconds
- **Live Metrics**: Current carbon intensity, efficiency, renewable usage
- **Instant Alerts**: Immediate notification of anomalies

### **3. Facility Management**
- **Individual Views**: Detailed metrics for each facility
- **Trend Analysis**: Historical performance data
- **Performance Comparison**: Side-by-side facility analysis

## 🔍 **How to Monitor Carbon Usage**

### **Step 1: Access the Dashboard**
1. Login as Admin user
2. Navigate to Admin Dashboard
3. Scroll to "🔌 IoT Carbon Intensity Monitoring" section
4. Click "View Dashboard" for detailed monitoring

### **Step 2: Review System Status**
- **Active Facilities**: Number of facilities being monitored
- **Environmental Score**: Overall system performance
- **Anomalies**: Current detected issues
- **Last Update**: When data was last refreshed

### **Step 3: Analyze Facility Performance**
- **Ranking**: See which facilities perform best
- **Carbon Intensity**: Compare CO2 emissions across facilities
- **Renewable Usage**: Identify renewable energy leaders
- **Efficiency**: Find most efficient operations

### **Step 4: Monitor Real-Time Data**
- **Live Updates**: Watch metrics change in real-time
- **Anomaly Detection**: Get alerts for unusual patterns
- **Trend Analysis**: See performance improvements/declines

## 📋 **Key Metrics to Watch**

### **1. Carbon Intensity (kg CO2/kg H2)**
- **Excellent**: ≤0.5 (Green)
- **Good**: 0.5-1.0 (Blue)
- **Moderate**: 1.0-2.0 (Yellow)
- **High**: 2.0-3.0 (Orange)
- **Very High**: >3.0 (Red)

### **2. Renewable Energy Usage (%)**
- **Excellent**: ≥80% (Green)
- **Good**: 60-79% (Blue)
- **Moderate**: 40-59% (Yellow)
- **Poor**: <40% (Red)

### **3. Efficiency Rating (%)**
- **Excellent**: ≥80% (Green)
- **Good**: 70-79% (Blue)
- **Average**: 60-69% (Yellow)
- **Below Average**: <60% (Red)

### **4. Environmental Score (0-100)**
- **Outstanding**: 90-100
- **Excellent**: 80-89
- **Good**: 70-79
- **Fair**: 60-69
- **Poor**: <60

## 🎯 **Best Practices for Carbon Reduction**

### **1. Renewable Energy Integration**
- **Solar Power**: Maximize daylight production
- **Wind Energy**: Leverage consistent wind patterns
- **Energy Storage**: Store excess renewable energy
- **Grid Integration**: Smart grid management

### **2. Efficiency Optimization**
- **Equipment Maintenance**: Regular maintenance schedules
- **Process Optimization**: Streamline production processes
- **Technology Upgrades**: Invest in modern equipment
- **Staff Training**: Educate operators on best practices

### **3. Monitoring & Analytics**
- **Real-Time Tracking**: Continuous performance monitoring
- **Trend Analysis**: Identify improvement opportunities
- **Anomaly Detection**: Quick response to issues
- **Performance Benchmarking**: Compare with industry leaders

## 🚀 **Getting Started**

### **1. Start the Backend**
```bash
cd project
node server.js
```

### **2. Start the Frontend**
```bash
cd client
npm run dev
```

### **3. Access IoT Monitoring**
1. Login with admin credentials
2. Navigate to Admin Dashboard
3. View IoT Carbon Intensity Monitoring section
4. Click "View Dashboard" for detailed monitoring

### **4. Test the System**
- **Emergency Simulation**: Test anomaly detection
- **Performance Monitoring**: Watch real-time updates
- **Facility Comparison**: Analyze different facility types
- **Trend Analysis**: Review historical performance

## 🔧 **Troubleshooting**

### **Common Issues**
1. **No Data Displayed**: Check if IoT simulation is running
2. **Anomaly Alerts**: Verify facility performance metrics
3. **Performance Issues**: Check browser console for errors
4. **Data Not Updating**: Verify backend is running and accessible

### **Support Commands**
- **Check IoT Status**: `GET /api/iot/status`
- **View Dashboard**: `GET /api/iot/dashboard`
- **Start Simulation**: `POST /api/iot/simulation/start`
- **Stop Simulation**: `POST /api/iot/simulation/stop`

## 🎉 **Benefits of AI-Powered Monitoring**

### **1. Real-Time Visibility**
- **Instant Updates**: Live monitoring of all facilities
- **Immediate Alerts**: Quick response to issues
- **Performance Tracking**: Continuous improvement monitoring

### **2. AI-Driven Insights**
- **Pattern Recognition**: Identify performance trends
- **Anomaly Detection**: Catch issues before they escalate
- **Predictive Analytics**: Forecast future performance

### **3. Environmental Impact**
- **Carbon Reduction**: Identify high-emission facilities
- **Efficiency Improvement**: Optimize production processes
- **Sustainability Goals**: Track progress toward targets

### **4. Competitive Advantage**
- **Performance Benchmarking**: Compare with industry standards
- **Best Practice Identification**: Learn from top performers
- **Continuous Improvement**: Data-driven optimization

---

## 📞 **Need Help?**

If you encounter any issues or have questions about the IoT monitoring system:

1. **Check the console logs** for error messages
2. **Verify backend connectivity** with health check endpoint
3. **Review facility data** in the monitoring dashboard
4. **Test emergency scenarios** to verify anomaly detection

The AI-powered IoT monitoring system provides comprehensive visibility into carbon intensity across all hydrogen production facilities, enabling data-driven decisions for environmental sustainability and operational excellence.
