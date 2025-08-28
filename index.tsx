// NOTE: This component requires 'expo-image-cropper' and 'expo-image-manipulator' as dependencies. Install them in your project for this component to work.
import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, ViewStyle, TouchableOpacity, Text } from 'react-native';
import ImageCropper from 'expo-image-cropper';
import * as ImageManipulator from 'expo-image-manipulator';

interface ImageCropperProps {
  imageUri: string;
  onCrop?: (croppedUri: string) => void;
  onCancel?: () => void;
  aspect?: [number, number];
  style?: ViewStyle;
}

const RNImageCropper: React.FC<ImageCropperProps> = ({ 
  imageUri, 
  onCrop, 
  onCancel, 
  aspect = [1, 1], 
  style = {} 
}) => {
  const [cropData, setCropData] = useState<any>(null);
  const [cropping, setCropping] = useState(false);

  // Debug logging on component mount
  useEffect(() => {
    console.log('ImageCropper mounted with props:');
    console.log('- imageUri:', imageUri);
    console.log('- onCrop exists:', !!onCrop);
    console.log('- onCancel exists:', !!onCancel);
    console.log('- aspect:', aspect);
  }, [imageUri, onCrop, onCancel, aspect]);

  const handleCrop = async () => {
    console.log('=== CROP BUTTON CLICKED ===');
    console.log('onCrop callback exists:', !!onCrop);
    console.log('cropData exists:', !!cropData);
    console.log('cropData:', cropData);
    
    if (!cropData) {
      console.log('❌ No crop data available - cannot crop');
      return;
    }
    
    setCropping(true);
    console.log('🔄 Starting crop process...');
    
    try {
      console.log('📸 Calling ImageManipulator.manipulateAsync...');
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ crop: cropData }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );
      
      setCropping(false);
      console.log('✅ Crop successful!');
      console.log('📁 Result URI:', result.uri);
      
      if (onCrop && typeof onCrop === 'function') {
        console.log('📞 Calling onCrop callback...');
        onCrop(result.uri);
        console.log('✅ onCrop callback executed');
      } else {
        console.log('❌ onCrop callback not provided or not a function');
      }
    } catch (error) {
      setCropping(false);
      console.error('❌ Cropping failed:', error);
    }
  };

  const handleCancel = () => {
    console.log('=== CANCEL BUTTON CLICKED ===');
    console.log('onCancel callback exists:', !!onCancel);
    console.log('onCancel type:', typeof onCancel);
    
    if (onCancel && typeof onCancel === 'function') {
      console.log('📞 Calling onCancel callback...');
      onCancel();
      console.log('✅ onCancel callback executed');
    } else {
      console.log('❌ onCancel callback not provided or not a function');
    }
  };

  return (
    <View style={[styles.container, style]}>
      <ImageCropper
        imageUri={imageUri}
        aspect={aspect}
        setCropData={setCropData}
        cropShape="rect"
        containerStyle={styles.cropper}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={handleCancel}
          disabled={cropping}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.cropButton, (!cropData || cropping) && styles.disabledButton]} 
          onPress={handleCrop}
          disabled={cropping || !cropData}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {cropping ? 'Cropping...' : 'Crop'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 400,
  },
  cropper: {
    width: 300,
    height: 300,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
  },
  cropButton: {
    backgroundColor: '#4ecdc4',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RNImageCropper; 
