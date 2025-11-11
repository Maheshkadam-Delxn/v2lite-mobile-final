import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal
} from 'react-native'
 
const GenericFormModal = ({ visible, onClose, type }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 12,
                paddingBottom: 32,
                maxHeight: '90%'
              }}
            >
              {/* Handle Bar */}
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View style={{
                  width: 40,
                  height: 4,
                  backgroundColor: '#E0E0E0',
                  borderRadius: 2
                }} />
              </View>
 
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 20 }}
              >
                {/* Header */}
                <Text style={{
                  fontFamily: 'Urbanist-Bold',
                  fontSize: 20,
                  color: '#000000',
                  textAlign: 'center',
                  marginBottom: 32
                }}>
                  {type}
                </Text>
 
                <Text style={{
                  fontFamily: 'Urbanist-Regular',
                  fontSize: 15,
                  color: '#666666',
                  textAlign: 'center',
                  marginBottom: 32
                }}>
                  Coming Soon...
                </Text>
 
                {/* Close Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#0066FF',
                    borderRadius: 12,
                    paddingVertical: 16,
                    alignItems: 'center',
                    marginBottom: 20
                  }}
                  onPress={onClose}
                >
                  <Text style={{
                    fontFamily: 'Urbanist-SemiBold',
                    fontSize: 16,
                    color: 'white'
                  }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  )
}
 
export default GenericFormModal
 