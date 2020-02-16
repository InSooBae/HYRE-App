import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import Loader from '../../components/Loader';
import constants from '../../constants';
import styles from '../../styles';

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Icon = styled.View``;

const Button = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: 10px solid ${styles.lightGreyColor};
`;

export default ({ navigation }) => {
  //카메라 ref
  const cameraRef = useRef();
  //사진 한번찍게
  const [canTakePhoto, setCanTakePhoto] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  //저장하려고 mediaLibrary사용 (MedaiLibrary.createAssetAsync)
  const takePhoto = async () => {
    if (!canTakePhoto) {
      return;
    }
    try {
      setCanTakePhoto(false);
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1
      });
      const asset = await MediaLibrary.createAssetAsync(uri);
      navigation.navigate('Upload', { photo: asset });
      console.log(asset);
    } catch (error) {
      console.log(error);
      setCanTakePhoto(true);
    }
  };
  const askPermission = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);

      if (status === 'granted') {
        setHasPermission(true);
      }
    } catch (e) {
      console.log(e);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };
  const toggleType = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };
  useEffect(() => {
    askPermission();
  }, []);
  return (
    <View>
      {loading ? (
        <Loader />
      ) : hasPermission ? (
        <>
          <Camera
            ref={cameraRef}
            type={cameraType}
            style={
              Platform.OS === 'ios'
                ? {
                    justifyContent: 'flex-end',
                    padding: 15,
                    width: constants.width,
                    ///2 = ios /1.5 = android
                    height: constants.height / 2
                  }
                : {
                    justifyContent: 'flex-end',
                    padding: 15,
                    width: constants.width,
                    ///2 = ios /1.5 = android
                    height: constants.height / 1.5
                  }
            }
          >
            <TouchableOpacity onPress={toggleType}>
              <Icon>
                <Ionicons
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-reverse-camera'
                      : 'md-reverse-camera'
                  }
                  size={32}
                  color={'white'}
                />
              </Icon>
            </TouchableOpacity>
          </Camera>
          <View>
            <TouchableOpacity onPress={takePhoto} disabled={!canTakePhoto}>
              <Button />
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
};
