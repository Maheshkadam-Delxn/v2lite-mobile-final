import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImagePreviewScreen = ({ route, navigation }) => {
  const { imageSource, planTitle } = route.params || {};
  
  const [zoomScale, setZoomScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Animation values
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Track cumulative translation for panning
  const cumulativeTranslateX = useRef(0);
  const cumulativeTranslateY = useRef(0);

  // Track initial values for gestures
  const initialScale = useRef(1);
  const initialDistance = useRef(0);
  const initialTranslateX = useRef(0);
  const initialTranslateY = useRef(0);

  // Pan responder for pinch-to-zoom and panning
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      
      onPanResponderGrant: (evt, gestureState) => {
        // Store initial values when gesture starts
        initialScale.current = zoomScale;
        initialTranslateX.current = cumulativeTranslateX.current;
        initialTranslateY.current = cumulativeTranslateY.current;
      },

      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        
        // Handle pinch gesture (two fingers)
        if (touches.length === 2) {
          const touch1 = touches[0];
          const touch2 = touches[1];
          
          // Calculate distance between fingers
          const dx = touch1.pageX - touch2.pageX;
          const dy = touch1.pageY - touch2.pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (initialDistance.current === 0) {
            initialDistance.current = distance;
          } else {
            // Calculate scale based on distance change
            const scaleChange = distance / initialDistance.current;
            const newScale = Math.max(1, Math.min(initialScale.current * scaleChange, 5));
            
            setZoomScale(newScale);
            setIsZoomed(newScale > 1);
            scale.setValue(newScale);
          }
        }
        // Handle pan gesture (one finger) - only when zoomed
        else if (touches.length === 1) {
          const { dx, dy } = gestureState;
          
          if (isZoomed) {
            // Calculate maximum translation based on zoom scale
            const maxTranslateX = (screenWidth * (zoomScale - 1)) / 2;
            const maxTranslateY = (screenWidth * 0.75 * (zoomScale - 1)) / 2;
            
            // Calculate new translation with boundaries
            const newTranslateX = initialTranslateX.current + dx;
            const newTranslateY = initialTranslateY.current + dy;
            
            // Apply boundaries to prevent over-panning
            const boundedX = Math.max(Math.min(newTranslateX, maxTranslateX), -maxTranslateX);
            const boundedY = Math.max(Math.min(newTranslateY, maxTranslateY), -maxTranslateY);
            
            // Update cumulative values
            cumulativeTranslateX.current = boundedX;
            cumulativeTranslateY.current = boundedY;
            
            // Animate the translation
            translateX.setValue(boundedX);
            translateY.setValue(boundedY);
          }
        }
      },

      onPanResponderRelease: () => {
        // Reset initial distance for next pinch gesture
        initialDistance.current = 0;
        
        // Smoothly return to boundaries if needed when zoomed out
        if (zoomScale === 1) {
          cumulativeTranslateX.current = 0;
          cumulativeTranslateY.current = 0;
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const handleZoomIn = () => {
    const newScale = Math.min(zoomScale + 0.5, 5);
    setZoomScale(newScale);
    setIsZoomed(newScale > 1);
    
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
    }).start();
  };

  const handleZoomOut = () => {
    const newScale = Math.max(zoomScale - 0.5, 1);
    setZoomScale(newScale);
    setIsZoomed(newScale > 1);
    
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
    }).start();
    
    // Reset position when fully zoomed out
    if (newScale === 1) {
      cumulativeTranslateX.current = 0;
      cumulativeTranslateY.current = 0;
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleResetZoom = () => {
    setZoomScale(1);
    setIsZoomed(false);
    
    cumulativeTranslateX.current = 0;
    cumulativeTranslateY.current = 0;
    
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDoubleTap = () => {
    if (zoomScale === 1) {
      handleZoomIn();
    } else {
      handleResetZoom();
    }
  };

  const animatedStyle = {
    transform: [
      { translateX: translateX },
      { translateY: translateY },
      { scale: scale },
    ],
  };

  if (!imageSource) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-black text-lg">No image to display</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 bg-white/90 pt-12 pb-4 px-4 flex-row items-center justify-between shadow-md">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center"
        >
          <Feather name="arrow-left" size={20} color="black" />
        </TouchableOpacity>

        <Text
          className="text-black text-lg font-semibold flex-1 mx-3 text-center"
          numberOfLines={1}
        >
          {planTitle || 'Plan Preview'}
        </Text>

        <View className="flex-row">
          <TouchableOpacity
            onPress={handleZoomOut}
            disabled={zoomScale <= 1}
            className={`w-10 h-10 rounded-full items-center justify-center mx-1 ${
              zoomScale <= 1 ? 'bg-gray-300' : 'bg-gray-200'
            }`}
          >
            <Feather
              name="zoom-out"
              size={20}
              color={zoomScale <= 1 ? 'gray' : 'black'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleZoomIn}
            disabled={zoomScale >= 5}
            className={`w-10 h-10 rounded-full items-center justify-center mx-1 ${
              zoomScale >= 5 ? 'bg-gray-300' : 'bg-gray-200'
            }`}
          >
            <Feather
              name="zoom-in"
              size={20}
              color={zoomScale >= 5 ? 'gray' : 'black'}
            />
          </TouchableOpacity>

          {isZoomed && (
            <TouchableOpacity
              onPress={handleResetZoom}
              className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mx-1"
            >
              <Feather name="maximize" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Image Container - Full screen touch area */}
      <View className="flex-1 mt-20">
        <View 
          className="flex-1"
          {...panResponder.panHandlers}
        >
          <Animated.View
            style={[animatedStyle, {
              width: screenWidth,
              height: screenWidth * 0.75,
              position: 'absolute',
              top: (screenHeight - 100 - screenWidth * 0.75) / 2,
              left: 0,
            }]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleDoubleTap}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <Image
                source={
                  typeof imageSource === 'string'
                    ? { uri: imageSource }
                    : imageSource
                }
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Zoom Indicator */}
      <View className="absolute bottom-20 left-0 right-0 items-center">
        <View className="bg-black/70 px-4 py-2 rounded-full">
          <Text className="text-white text-sm">
            Zoom: {zoomScale.toFixed(1)}x • {isZoomed ? 'Drag to pan' : 'Pinch to zoom'}
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View className="absolute bottom-10 left-0 right-0 items-center">
        <Text className="text-black/50 text-xs text-center">
          Double tap to zoom in/out • Pinch with two fingers to zoom • Drag to pan when zoomed
        </Text>
      </View>
    </View>
  );
};

export default ImagePreviewScreen;