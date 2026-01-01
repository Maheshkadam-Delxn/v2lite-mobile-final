import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native'

const TransactionAdd = ({ navigation }) => {
  const paymentTypes = [
    { id: 1, label: 'Outgoing Payment', color: '#FFE0E0', textColor: '#FF4444' },
    { id: 2, label: 'Incoming Payment', color: '#D4F5E9', textColor: '#00C896' },
  ]

  const debitNote = { label: 'Debit Note', color: '#D4F0FF', textColor: '#00A3E0' }

  const salesType = { label: 'Sales Invoice', color: '#D4F0FF', textColor: '#00A3E0' }

  const expenseTypes = [
    { id: 1, label: 'Material Purchase', color: '#D4F0FF', textColor: '#00A3E0' },
    { id: 2, label: 'Material Return', color: '#D4F0FF', textColor: '#00A3E0' },
    { id: 3, label: 'Material Transfer', color: '#D4F0FF', textColor: '#00A3E0' },
    { id: 4, label: 'Other Expense', color: '#D4F0FF', textColor: '#00A3E0' },
  ]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <TouchableOpacity 
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => navigation.goBack()}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity 
            activeOpacity={1}
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 12,
              paddingBottom: 32
            }}
          >
            {/* Handle Bar */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View style={{
                width: 40,
                height: 4,
                backgroundColor: '#E0E0E0',
                borderRadius: 2
              }} />
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 500 }}
            >
              {/* Payment Section */}
              <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 14,
                  color: '#999999',
                  marginBottom: 12
                }}>
                  Payment
                </Text>
                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 12
                }}>
                  {paymentTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={{
                        flex: 1,
                        backgroundColor: type.color,
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderRadius: 12,
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{
                        fontFamily: 'Urbanist-SemiBold',
                        fontSize: 14,
                        color: type.textColor
                      }}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: debitNote.color,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: debitNote.textColor
                  }}>
                    {debitNote.label}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sales Section */}
              <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 14,
                  color: '#999999',
                  marginBottom: 12
                }}>
                  Sales
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: salesType.color,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 14,
                    color: salesType.textColor
                  }}>
                    {salesType.label}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Expense Section */}
              <View style={{ paddingHorizontal: 24 }}>
                <Text style={{
                  fontFamily: 'Urbanist-Medium',
                  fontSize: 14,
                  color: '#999999',
                  marginBottom: 12
                }}>
                  Expense
                </Text>
                <View style={{ gap: 12 }}>
                  <View style={{
                    flexDirection: 'row',
                    gap: 12
                  }}>
                    {expenseTypes.slice(0, 2).map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        style={{
                          flex: 1,
                          backgroundColor: type.color,
                          paddingVertical: 14,
                          paddingHorizontal: 16,
                          borderRadius: 12,
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 14,
                          color: type.textColor
                        }}>
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    gap: 12
                  }}>
                    {expenseTypes.slice(2, 4).map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        style={{
                          flex: 1,
                          backgroundColor: type.color,
                          paddingVertical: 14,
                          paddingHorizontal: 16,
                          borderRadius: 12,
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{
                          fontFamily: 'Urbanist-SemiBold',
                          fontSize: 14,
                          color: type.textColor
                        }}>
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default TransactionAdd