import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Header from '@/components/Header'
import DateTimePicker from '@react-native-community/datetimepicker'

const ReportDetailScreen = ({ navigation }) => {
  const [selectedDuration, setSelectedDuration] = useState('today')
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const [showFromDatePicker, setShowFromDatePicker] = useState(false)
  const [showToDatePicker, setShowToDatePicker] = useState(false)
  const [isDurationExpanded, setIsDurationExpanded] = useState(true)
  const [isPartsExpanded, setIsPartsExpanded] = useState(true)
  
  const [reportParts, setReportParts] = useState({
    progress: true,
    attachments: true,
    issues: true,
    inventory: true,
    payment: true
  })

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const onFromDateChange = (event, selectedDate) => {
    setShowFromDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      setFromDate(selectedDate)
    }
  }

  const onToDateChange = (event, selectedDate) => {
    setShowToDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      setToDate(selectedDate)
    }
  }

  const toggleReportPart = (part) => {
    setReportParts(prev => ({
      ...prev,
      [part]: !prev[part]
    }))
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      
      {/* Header */}
      <Header 
        title="View Progress Report" 
        showBackButton={true} 
        showNotification={true}
        backgroundColor="#0066FF" 
        titleColor="white" 
        iconColor="white" 
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Select Duration Card */}
        <View className="bg-white mx-4 mt-4 rounded-[16px] p-4">
          <TouchableOpacity 
            className="flex-row items-center justify-between mb-4"
            onPress={() => setIsDurationExpanded(!isDurationExpanded)}
          >
            <Text className="text-[#1E1E1E] text-[18px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
              Select Duration
            </Text>
            <Ionicons name={isDurationExpanded ? "chevron-up" : "chevron-down"} size={24} color="#1E1E1E" />
          </TouchableOpacity>

          {isDurationExpanded && (
            <>
              {/* Duration Options */}
              <View className="flex-row items-center justify-between mb-6">
                <TouchableOpacity 
                  className="flex-row items-center"
                  onPress={() => setSelectedDuration('today')}
                >
                  <View className={`w-7 h-7 rounded-full border-[3px] items-center justify-center mr-2 ${selectedDuration === 'today' ? 'border-[#0066FF]' : 'border-[#D0D0D0]'}`}>
                    {selectedDuration === 'today' && (
                      <View className="w-3.5 h-3.5 rounded-full bg-[#0066FF]"></View>
                    )}
                  </View>
                  <Text className="text-[#1E1E1E] text-[16px]" style={{ fontFamily: 'Urbanist-Medium' }}>
                    Today
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row items-center"
                  onPress={() => setSelectedDuration('7days')}
                >
                  <View className={`w-7 h-7 rounded-full border-[3px] items-center justify-center mr-2 ${selectedDuration === '7days' ? 'border-[#0066FF]' : 'border-[#D0D0D0]'}`}>
                    {selectedDuration === '7days' && (
                      <View className="w-3.5 h-3.5 rounded-full bg-[#0066FF]"></View>
                    )}
                  </View>
                  <Text className="text-[#1E1E1E] text-[16px]" style={{ fontFamily: 'Urbanist-Medium' }}>
                    7 Days
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="flex-row items-center"
                  onPress={() => setSelectedDuration('15days')}
                >
                  <View className={`w-7 h-7 rounded-full border-[3px] items-center justify-center mr-2 ${selectedDuration === '15days' ? 'border-[#0066FF]' : 'border-[#D0D0D0]'}`}>
                    {selectedDuration === '15days' && (
                      <View className="w-3.5 h-3.5 rounded-full bg-[#0066FF]"></View>
                    )}
                  </View>
                  <Text className="text-[#1E1E1E] text-[16px]" style={{ fontFamily: 'Urbanist-Medium' }}>
                    15 Days
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Date Selection */}
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-6">
                  <Text className="text-[#1E1E1E] text-[15px] font-semibold mb-3" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    From Date
                  </Text>
                  <TouchableOpacity 
                    className="flex-row items-center justify-between pb-2 border-b border-[#E0E0E0]"
                    onPress={() => setShowFromDatePicker(true)}
                  >
                    <Text className="text-[#1E1E1E] text-[16px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                      {formatDate(fromDate)}
                    </Text>
                    <Ionicons name="calendar-outline" size={22} color="#666" />
                  </TouchableOpacity>
                  {showFromDatePicker && (
                    <DateTimePicker
                      value={fromDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onFromDateChange}
                    />
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-[#1E1E1E] text-[15px] font-semibold mb-3" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    To Date
                  </Text>
                  <TouchableOpacity 
                    className="flex-row items-center justify-between pb-2 border-b border-[#E0E0E0]"
                    onPress={() => setShowToDatePicker(true)}
                  >
                    <Text className="text-[#1E1E1E] text-[16px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                      {formatDate(toDate)}
                    </Text>
                    <Ionicons name="calendar-outline" size={22} color="#666" />
                  </TouchableOpacity>
                  {showToDatePicker && (
                    <DateTimePicker
                      value={toDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onToDateChange}
                      minimumDate={fromDate}
                    />
                  )}
                </View>
              </View>
            </>
          )}
        </View>

        {/* Parts in the Report Card */}
        <View className="bg-white mx-4 mt-4 rounded-[16px] p-4 mb-6">
          <TouchableOpacity 
            className="flex-row items-center justify-between mb-4"
            onPress={() => setIsPartsExpanded(!isPartsExpanded)}
          >
            <Text className="text-[#1E1E1E] text-[18px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
              Parts in the Report
            </Text>
            <Ionicons name={isPartsExpanded ? "chevron-up" : "chevron-down"} size={24} color="#1E1E1E" />
          </TouchableOpacity>

          {isPartsExpanded && (
            <>
              {/* Progress */}
              <TouchableOpacity 
                className="flex-row items-start justify-between py-3 border-b border-[#F0F0F0]"
                onPress={() => toggleReportPart('progress')}
              >
                <View className="flex-1 mr-3">
                  <Text className="text-[#1E1E1E] text-[16px] font-semibold mb-1" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    Progress
                  </Text>
                  <Text className="text-[#1E1E1E] text-[13px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Includes task progress, attendance & remarks
                  </Text>
                </View>
                <View className={`w-6 h-6 rounded-full items-center justify-center ${reportParts.progress ? 'bg-[#0066FF]' : 'bg-white border-2 border-[#D0D0D0]'}`}>
                  {reportParts.progress && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Attachments */}
              <TouchableOpacity 
                className="flex-row items-start justify-between py-3 border-b border-[#F0F0F0]"
                onPress={() => toggleReportPart('attachments')}
              >
                <View className="flex-1 mr-3">
                  <Text className="text-[#1E1E1E] text-[16px] font-semibold mb-1" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    Attachments
                  </Text>
                  <Text className="text-[#1E1E1E] text-[13px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Includes all photos
                  </Text>
                </View>
                <View className={`w-6 h-6 rounded-full items-center justify-center ${reportParts.attachments ? 'bg-[#0066FF]' : 'bg-white border-2 border-[#D0D0D0]'}`}>
                  {reportParts.attachments && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Issues */}
              <TouchableOpacity 
                className="flex-row items-start justify-between py-3 border-b border-[#F0F0F0]"
                onPress={() => toggleReportPart('issues')}
              >
                <View className="flex-1 mr-3">
                  <Text className="text-[#1E1E1E] text-[16px] font-semibold mb-1" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    Issues
                  </Text>
                  <Text className="text-[#1E1E1E] text-[13px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Includes all issues
                  </Text>
                </View>
                <View className={`w-6 h-6 rounded-full items-center justify-center ${reportParts.issues ? 'bg-[#0066FF]' : 'bg-white border-2 border-[#D0D0D0]'}`}>
                  {reportParts.issues && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Inventory */}
              <TouchableOpacity 
                className="flex-row items-start justify-between py-3 border-b border-[#F0F0F0]"
                onPress={() => toggleReportPart('inventory')}
              >
                <View className="flex-1 mr-3">
                  <Text className="text-[#1E1E1E] text-[16px] font-semibold mb-1" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    Inventory
                  </Text>
                  <Text className="text-[#1E1E1E] text-[13px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Includes used , added & in stock materials
                  </Text>
                </View>
                <View className={`w-6 h-6 rounded-full items-center justify-center ${reportParts.inventory ? 'bg-[#0066FF]' : 'bg-white border-2 border-[#D0D0D0]'}`}>
                  {reportParts.inventory && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Payment */}
              <TouchableOpacity 
                className="flex-row items-start justify-between py-3"
                onPress={() => toggleReportPart('payment')}
              >
                <View className="flex-1 mr-3">
                  <Text className="text-[#1E1E1E] text-[16px] font-semibold mb-1" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    Payment
                  </Text>
                  <Text className="text-[#1E1E1E] text-[13px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Includes task costing
                  </Text>
                </View>
                <View className={`w-6 h-6 rounded-full items-center justify-center ${reportParts.payment ? 'bg-[#0066FF]' : 'bg-white border-2 border-[#D0D0D0]'}`}>
                  {reportParts.payment && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Create Report Button */}
        <View className="px-4 mb-6">
          <TouchableOpacity 
            className="bg-[#0066FF] rounded-[16px] py-4"
            onPress={() => navigation.navigate('View Report')}
          >
            <Text className="text-white text-[16px] font-semibold text-center" style={{ fontFamily: 'Urbanist-SemiBold' }}>
              Create Report
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ReportDetailScreen