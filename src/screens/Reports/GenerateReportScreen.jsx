import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert, Share } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Header from '@/components/Header'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system/legacy'

const ViewReportScreen = ({ navigation }) => {
  const [reportData] = useState({
    projectName: 'test',
    datesAdded: false,
    tasksCompleted: { total: 0, delayed: 0 },
    tasksInProgress: { total: 1, delayed: 0 },
    tasksNotStarted: { total: 0, delayed: 0 },
    todayActivity: {
      taskUpdates: 1,
      issuesCreated: 1,
      attendanceLogged: 0
    },
    taskUpdate: {
      date: '01 Apr, 2025',
      category: 'Design',
      taskName: '#1. test',
      totalPlannedQuantity: '100 %',
      startDate: 'DD/MM/YYYY',
      endDate: 'DD/MM/YYYY',
      updatedBy: 'Arun Mishra',
      updateDate: '01 Apr, 2025',
      quantityTillDate: '30%',
      todayUpdate: '30%',
      quantityLeft: '70.00 %',
      remark: '--',
      hasAttendance: false
    },
    labourGrandTotal: {
      myLabour: { present: 0, halfDay: 0, absent: 0 },
      vendorLabour: { present: 0, halfDay: 0, absent: 0 }
    },
    issues: [
      {
        id: 'ISS001',
        title: 'Issue 01 - test',
        status: 'Open',
        remarks: 'testing',
        dueDate: 'Apr 04, 2025'
      }
    ]
  })

  const handleEdit = () => {
    // Show alert for edit functionality
    Alert.alert(
      'Edit Report',
      'Do you want to edit this report?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Edit',
          onPress: () => {
            // Navigate to ReportDetailScreen to create/edit report
            navigation.navigate('ReportDetailScreen', { reportData })
          }
        }
      ]
    )
  }

  const generateHTMLReport = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #1E1E1E;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #0066FF;
            }
            .project-info {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #0066FF;
            }
            .task-summary {
              display: flex;
              gap: 10px;
              margin-bottom: 20px;
            }
            .task-card {
              flex: 1;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid;
            }
            .completed {
              background: #E8F5E9;
              border-color: #4CAF50;
            }
            .in-progress {
              background: #FFF8E1;
              border-color: #FFA726;
            }
            .not-started {
              background: #F5F5F5;
              border-color: #9E9E9E;
            }
            .activity-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            .task-detail {
              background: #f9f9f9;
              padding: 15px;
              border-left: 3px solid #FFA726;
              margin-bottom: 15px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #e0e0e0;
            }
            th {
              background: #f5f5f5;
              font-weight: bold;
            }
            .issue-item {
              background: #f9f9f9;
              padding: 12px;
              border-radius: 6px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>View Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="project-info">
            <h3>${reportData.projectName}</h3>
            <p>${reportData.datesAdded ? 'Dates added' : 'No dates added'}</p>
          </div>

          <div class="section">
            <div class="section-title">Tasks Summary</div>
            <div class="task-summary">
              <div class="task-card completed">
                <strong>COMPLETED</strong>
                <p>Total: ${reportData.tasksCompleted.total} | Delayed: ${reportData.tasksCompleted.delayed}</p>
              </div>
              <div class="task-card in-progress">
                <strong>IN PROGRESS</strong>
                <p>Total: ${reportData.tasksInProgress.total} | Delayed: ${reportData.tasksInProgress.delayed}</p>
              </div>
              <div class="task-card not-started">
                <strong>NOT STARTED</strong>
                <p>Total: ${reportData.tasksNotStarted.total} | Delayed: ${reportData.tasksNotStarted.delayed}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Today's Activity</div>
            <div class="activity-row">
              <span>Task Updates: ${reportData.todayActivity.taskUpdates}</span>
              <span>Issues Created: ${reportData.todayActivity.issuesCreated}</span>
              <span>Attendance Logged: ${reportData.todayActivity.attendanceLogged}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Task Updates: ${reportData.taskUpdate.date}</div>
            <div class="task-detail">
              <h4>${reportData.taskUpdate.taskName}</h4>
              <p>Category: ${reportData.taskUpdate.category}</p>
              <p>Total Planned Quantity: ${reportData.taskUpdate.totalPlannedQuantity}</p>
              <p>Start: ${reportData.taskUpdate.startDate} | End: ${reportData.taskUpdate.endDate}</p>
              <p>Latest Update By: ${reportData.taskUpdate.updatedBy} on ${reportData.taskUpdate.updateDate}</p>
              <p><strong>Progress:</strong></p>
              <p>Quantity Till Date: ${reportData.taskUpdate.quantityTillDate}</p>
              <p>Today's Update: ${reportData.taskUpdate.todayUpdate}</p>
              <p>Quantity Left: ${reportData.taskUpdate.quantityLeft}</p>
              <p><strong>Remark:</strong> ${reportData.taskUpdate.remark}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Labour Grand Total</div>
            <table>
              <thead>
                <tr>
                  <th>Labour</th>
                  <th>Total Present</th>
                  <th>Total Half Day</th>
                  <th>Total Absent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>My Labour (0)</td>
                  <td>${reportData.labourGrandTotal.myLabour.present}</td>
                  <td>${reportData.labourGrandTotal.myLabour.halfDay}</td>
                  <td>${reportData.labourGrandTotal.myLabour.absent}</td>
                </tr>
                <tr>
                  <td>Vendor Labour (0)</td>
                  <td>${reportData.labourGrandTotal.vendorLabour.present}</td>
                  <td>${reportData.labourGrandTotal.vendorLabour.halfDay}</td>
                  <td>${reportData.labourGrandTotal.vendorLabour.absent}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">ISSUES</div>
            ${reportData.issues.map(issue => `
              <div class="issue-item">
                <h4>${issue.title} - ${issue.status}</h4>
                <p>${issue.id}</p>
                <p>Issue Remarks: ${issue.remarks}</p>
                <p>Issue Due Date: ${issue.dueDate}</p>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `
  }

  const handleDownload = async () => {
    try {
      // Generate HTML report
      const html = generateHTMLReport()
      
      // Create PDF from HTML
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false
      })
      
      // Define the new file path
      const fileName = `Report_${reportData.projectName}_${new Date().getTime()}.pdf`
      const newPath = `${FileSystem.documentDirectory}${fileName}`
      
      // Move the file to a permanent location
      await FileSystem.moveAsync({
        from: uri,
        to: newPath
      })
      
      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save or Share Report'
        })
        Alert.alert('Success', 'Report downloaded successfully!')
      } else {
        Alert.alert('Success', `Report saved to: ${newPath}`)
      }
    } catch (error) {
      console.error('Error downloading report:', error)
      Alert.alert('Error', 'Failed to download report. Please try again.')
    }
  }

  const handleShare = async () => {
    try {
      // Generate HTML report
      const html = generateHTMLReport()
      
      // Create PDF from HTML
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false
      })
      
      // Define the new file path
      const fileName = `Report_${reportData.projectName}_${new Date().getTime()}.pdf`
      const newPath = `${FileSystem.documentDirectory}${fileName}`
      
      // Move the file to a permanent location
      await FileSystem.moveAsync({
        from: uri,
        to: newPath
      })
      
      // Share using native share dialog
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Report'
        })
      } else {
        // Fallback to React Native Share
        await Share.share({
          title: 'Share Report',
          message: `View Report for ${reportData.projectName}`,
          url: newPath
        })
      }
    } catch (error) {
      console.error('Error sharing report:', error)
      Alert.alert('Error', 'Failed to share report. Please try again.')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <StatusBar barStyle="light-content" backgroundColor="#0066FF" />
      
      {/* Header */}
      <Header 
        title="View Report" 
        showBackButton={true} 
        showNotification={true}
        backgroundColor="#0066FF" 
        titleColor="white" 
        iconColor="white" 
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Project Info Card */}
        <View className="bg-white mx-4 mt-4 rounded-[12px] p-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-[#E0E0E0] rounded-[8px] mr-3"></View>
            <View className="flex-1">
              <Text className="text-[#1E1E1E] text-[16px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {reportData.projectName}
              </Text>
              <Text className="text-[#999] text-[13px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                {reportData.datesAdded ? 'Dates added' : 'No dates added'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tasks Summary */}
        <View className="bg-white mx-4 mt-4 rounded-[12px] p-4">
          <View className="flex-row items-center mb-4">
            <Ionicons name="clipboard-outline" size={20} color="#666" />
            <Text className="text-[#1E1E1E] text-[16px] font-semibold ml-2" style={{ fontFamily: 'Urbanist-SemiBold' }}>
              Tasks Summary
            </Text>
          </View>

          <View className="flex-row gap-3">
            {/* Completed */}
            <View className="flex-1 bg-[#E8F5E9] rounded-[12px] p-3 border-l-4 border-[#4CAF50]">
              <Text className="text-[#4CAF50] text-[12px] font-semibold mb-2" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                COMPLETED
              </Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-[#666] text-[11px]" style={{ fontFamily: 'Urbanist-Regular' }}>Total</Text>
                  <Text className="text-[#1E1E1E] text-[20px] font-bold" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {reportData.tasksCompleted.total}
                  </Text>
                </View>
                <View>
                  <Text className="text-[#E53935] text-[11px]" style={{ fontFamily: 'Urbanist-Regular' }}>Delayed</Text>
                  <Text className="text-[#1E1E1E] text-[20px] font-bold" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {reportData.tasksCompleted.delayed}
                  </Text>
                </View>
              </View>
            </View>

            {/* In Progress */}
            <View className="flex-1 bg-[#FFF8E1] rounded-[12px] p-3 border-l-4 border-[#FFA726]">
              <Text className="text-[#FFA726] text-[12px] font-semibold mb-2" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                IN PROGRESS
              </Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-[#666] text-[11px]" style={{ fontFamily: 'Urbanist-Regular' }}>Total</Text>
                  <Text className="text-[#1E1E1E] text-[20px] font-bold" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {reportData.tasksInProgress.total}
                  </Text>
                </View>
                <View>
                  <Text className="text-[#E53935] text-[11px]" style={{ fontFamily: 'Urbanist-Regular' }}>Delayed</Text>
                  <Text className="text-[#1E1E1E] text-[20px] font-bold" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {reportData.tasksInProgress.delayed}
                  </Text>
                </View>
              </View>
            </View>

            {/* Not Started */}
            <View className="flex-1 bg-[#F5F5F5] rounded-[12px] p-3 border-l-4 border-[#9E9E9E]">
              <Text className="text-[#9E9E9E] text-[12px] font-semibold mb-2" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                NOT STARTED
              </Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-[#666] text-[11px]" style={{ fontFamily: 'Urbanist-Regular' }}>Total</Text>
                  <Text className="text-[#1E1E1E] text-[20px] font-bold" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {reportData.tasksNotStarted.total}
                  </Text>
                </View>
                <View>
                  <Text className="text-[#E53935] text-[11px]" style={{ fontFamily: 'Urbanist-Regular' }}>Delayed</Text>
                  <Text className="text-[#1E1E1E] text-[20px] font-bold" style={{ fontFamily: 'Urbanist-Bold' }}>
                    {reportData.tasksNotStarted.delayed}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Activity */}
        <View className="bg-white mx-4 mt-4 rounded-[12px] p-4">
          <Text className="text-[#1E1E1E] text-[16px] font-semibold mb-4" style={{ fontFamily: 'Urbanist-SemiBold' }}>
            Today's Activity
          </Text>

          <View className="flex-row justify-between items-center">
            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <Ionicons name="clipboard-outline" size={16} color="#666" />
                <Text className="text-[#666] text-[12px] ml-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                  Task Updates
                </Text>
              </View>
              <Text className="text-[#1E1E1E] text-[18px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {reportData.todayActivity.taskUpdates}
              </Text>
            </View>

            <View className="w-[1px] h-10 bg-[#E0E0E0]"></View>

            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <Ionicons name="alert-circle-outline" size={16} color="#666" />
                <Text className="text-[#666] text-[12px] ml-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                  Issues Created
                </Text>
              </View>
              <Text className="text-[#1E1E1E] text-[18px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {reportData.todayActivity.issuesCreated}
              </Text>
            </View>

            <View className="w-[1px] h-10 bg-[#E0E0E0]"></View>

            <View className="flex-1 items-center">
              <View className="flex-row items-center mb-1">
                <Ionicons name="person-outline" size={16} color="#666" />
                <Text className="text-[#666] text-[12px] ml-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                  Attendance Logged
                </Text>
              </View>
              <Text className="text-[#1E1E1E] text-[18px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {reportData.todayActivity.attendanceLogged}
              </Text>
            </View>
          </View>
        </View>

        {/* Task Updates Section */}
        <View className="bg-white mx-4 mt-4 rounded-[12px] p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[#1E1E1E] text-[13px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
              Task Updates: {reportData.taskUpdate.date}
            </Text>
            <Text className="text-[#999] text-[12px]" style={{ fontFamily: 'Urbanist-Regular' }}>
              Category: {reportData.taskUpdate.category}
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-[#666] text-[13px] font-medium" style={{ fontFamily: 'Urbanist-Medium' }}>
              Task Name
            </Text>
            <Text className="text-[#666] text-[13px] font-medium" style={{ fontFamily: 'Urbanist-Medium' }}>
              Progress/Attendance
            </Text>
          </View>

          <View className="flex-row">
            <View className="w-1 bg-[#FFA726] rounded-full mr-3"></View>
            <View className="flex-1">
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-[#1E1E1E] text-[14px] font-semibold mb-3" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                    {reportData.taskUpdate.taskName}
                  </Text>

                  <View className="flex-row items-center mb-2">
                    <Ionicons name="checkmark-circle-outline" size={14} color="#666" />
                    <Text className="text-[#666] text-[12px] ml-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                      Total Planned Quantity: {reportData.taskUpdate.totalPlannedQuantity}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar-outline" size={14} color="#666" />
                    <Text className="text-[#666] text-[12px] ml-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                      Start: {reportData.taskUpdate.startDate}   End: {reportData.taskUpdate.endDate}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-3">
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text className="text-[#666] text-[12px] ml-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                      Latest Update By: {reportData.taskUpdate.updatedBy} on {reportData.taskUpdate.updateDate}
                    </Text>
                  </View>

                  <Text className="text-[#666] text-[12px] mb-1 italic" style={{ fontFamily: 'Urbanist-Regular' }}>
                    Remark:
                  </Text>
                  <Text className="text-[#1E1E1E] text-[12px] mb-3" style={{ fontFamily: 'Urbanist-Regular' }}>
                    {reportData.taskUpdate.remark}
                  </Text>
                </View>

                <View className="ml-4">
                  <View className="mb-4">
                    <Text className="text-[#999] text-[10px] mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                      Quantity Till Date
                    </Text>
                    <Text className="text-[#1E1E1E] text-[13px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                      {reportData.taskUpdate.quantityTillDate}
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-[#999] text-[10px] mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                      Today's Update
                    </Text>
                    <Text className="text-[#1E1E1E] text-[13px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                      {reportData.taskUpdate.todayUpdate}
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-[#999] text-[10px] mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                      Quantity Left
                    </Text>
                    <Text className="text-[#1E1E1E] text-[13px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                      {reportData.taskUpdate.quantityLeft}
                    </Text>
                  </View>

                  {!reportData.taskUpdate.hasAttendance && (
                    <View className="flex-row items-center">
                      <Ionicons name="information-circle-outline" size={14} color="#999" />
                      <Text className="text-[#999] text-[10px] ml-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                        No Attendance{'\n'}Record Added
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Labour Grand Total */}
        <View className="bg-white mx-4 mt-4 rounded-[12px] p-4">
          <Text className="text-[#1E1E1E] text-[16px] font-semibold mb-4" style={{ fontFamily: 'Urbanist-SemiBold' }}>
            Labour Grand Total (0)
          </Text>

          {/* Table Header */}
          <View className="flex-row mb-2">
            <View className="flex-1">
              <Text className="text-[#1E1E1E] text-[13px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                Labour
              </Text>
            </View>
            <View className="flex-1 bg-[#E8F5E9] rounded-[8px] py-2 items-center mx-1">
              <Text className="text-[#4CAF50] text-[11px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                Total Present (0)
              </Text>
            </View>
            <View className="flex-1 bg-[#FFF8E1] rounded-[8px] py-2 items-center mx-1">
              <Text className="text-[#FFA726] text-[11px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                Total Half Day (0)
              </Text>
            </View>
            <View className="flex-1 bg-[#FFEBEE] rounded-[8px] py-2 items-center ml-1">
              <Text className="text-[#E53935] text-[11px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                Total Absent (0)
              </Text>
            </View>
          </View>

          {/* Table Rows */}
          <View className="flex-row py-3 border-b border-[#F0F0F0]">
            <View className="flex-1">
              <Text className="text-[#1E1E1E] text-[13px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                My Labour (0)
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[#1E1E1E] text-[14px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {reportData.labourGrandTotal.myLabour.present}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[#1E1E1E] text-[14px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {reportData.labourGrandTotal.myLabour.halfDay}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[#1E1E1E] text-[14px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {reportData.labourGrandTotal.myLabour.absent}
              </Text>
            </View>
          </View>

          <View className="flex-row py-3">
            <View className="flex-1">
              <Text className="text-[#1E1E1E] text-[13px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                Vendor Labour (0)
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[#1E1E1E] text-[14px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {reportData.labourGrandTotal.vendorLabour.present}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[#1E1E1E] text-[14px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {reportData.labourGrandTotal.vendorLabour.halfDay}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[#1E1E1E] text-[14px] font-semibold" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                {reportData.labourGrandTotal.vendorLabour.absent}
              </Text>
            </View>
          </View>
        </View>

        {/* Issues Section */}
        <View className="bg-white mx-4 mt-4 rounded-[12px] p-4 mb-6">
          <Text className="text-[#999] text-[12px] mb-3" style={{ fontFamily: 'Urbanist-SemiBold' }}>
            ISSUES
          </Text>

          {reportData.issues.map((issue, index) => (
            <View key={index} className="mb-3">
              <View className="flex-row items-center mb-2">
                <Text className="text-[#1E1E1E] text-[14px] font-semibold mr-2" style={{ fontFamily: 'Urbanist-SemiBold' }}>
                  {issue.title}
                </Text>
                <View className="bg-[#E0E0E0] rounded-full px-3 py-1">
                  <Text className="text-[#666] text-[11px]" style={{ fontFamily: 'Urbanist-Medium' }}>
                    {issue.status}
                  </Text>
                </View>
              </View>
              <Text className="text-[#666] text-[13px] mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                {issue.id}
              </Text>
              <Text className="text-[#666] text-[13px] mb-1" style={{ fontFamily: 'Urbanist-Regular' }}>
                Issue Remarks: {issue.remarks}
              </Text>
              <Text className="text-[#666] text-[13px]" style={{ fontFamily: 'Urbanist-Regular' }}>
                Issue Due Date: {issue.dueDate}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row px-4 pb-6 gap-3">
          <TouchableOpacity 
            className="flex-1 bg-[#0066FF] rounded-[16px] py-4 flex-row items-center justify-center"
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={22} color="white" />
            <Text className="text-white text-[16px] font-semibold ml-2" style={{ fontFamily: 'Urbanist-SemiBold' }}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 bg-[#0066FF] rounded-[16px] py-4 flex-row items-center justify-center"
            onPress={handleDownload}
          >
            <Ionicons name="download-outline" size={22} color="white" />
            <Text className="text-white text-[16px] font-semibold ml-2" style={{ fontFamily: 'Urbanist-SemiBold' }}>
              Download
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 bg-[#0066FF] rounded-[16px] py-4 flex-row items-center justify-center"
            onPress={handleShare}
          >
            <Ionicons name="paper-plane-outline" size={22} color="white" />
            <Text className="text-white text-[16px] font-semibold ml-2" style={{ fontFamily: 'Urbanist-SemiBold' }}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ViewReportScreen