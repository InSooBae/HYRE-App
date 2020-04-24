import React, { useState } from 'react';
import {
  Content,
  Card,
  CardItem,
  Body,
  Left,
  Thumbnail,
  Right,
  ListItem,
  List,
  View,
  Icon,
  Toast,
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  callNumber,
  linkEmail,
  linkMessage,
  inputPhoneNumber,
} from './PhoneCall';
import { Avatar, Button } from 'react-native-paper';
import styles from '../styles';

import styled from 'styled-components';
import { Platform, Image, Modal } from 'react-native';
import Texts from '../Text';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

const Text = styled.Text`
  font-family: lotte-bold;
  font-weight: 700;
`;

export default ({
  id,
  name,
  birth,
  email,
  cellPhone,
  company,
  companyDesc,
  team,
  position,
  workPhone,
  workAddress,
  photo,
  generation,
  major,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const saveFile = async (fileUri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);
    } else {
      alert('사진 권한을 허락해주세요!');
      return;
    }
  };
  function downloadFile() {
    const uri = photo;
    let fileUri = FileSystem.documentDirectory + 'small.jpg';
    FileSystem.downloadAsync(uri, fileUri)
      .then(({ uri }) => {
        saveFile(uri);
        Toast.show({
          text: '이미지를 저장하셨습니다.',
          textStyle: { textAlign: 'center' },
          buttonText: 'Okay',
          type: 'success',
          position: 'top',
          duration: 5000,
          style: { marginTop: 70 },
        });
        setIsOpen(false);
      })
      .catch((error) => {
        Toast.show({
          text: '이미지를 저장에 실패하셨습니다.',
          textStyle: { textAlign: 'center' },
          buttonText: 'Okay',
          type: 'danger',
          position: 'top',
          duration: 5000,
          style: { marginTop: 70 },
        });
      });
  }

  return (
    <View style={{ backgroundColor: 'white' }}>
      {photo === '' ? null : (
        <Modal
          visible={isOpen}
          transparent={true}
          animationType="fade"
          onDismiss={() => setIsOpen(false)}
        >
          <View
            style={{
              backgroundColor: '#000000aa',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                marginRight: 20,
                marginBottom: 80,
                marginLeft: 20,
                marginTop: 80,
                borderRadius: 10,
                flex: 1,
              }}
            >
              <Image
                style={{ flex: 1 }}
                source={{ uri: photo }}
                resizeMode="contain"
              ></Image>

              <Button
                mode="contained"
                color="white"
                onPress={downloadFile}
                style={{ marginBottom: 20 }}
              >
                저장
              </Button>
              <Button
                mode="contained"
                color="white"
                onPress={() => setIsOpen(false)}
                style={{ marginBottom: 20 }}
              >
                닫기
              </Button>
            </View>
          </View>
        </Modal>
      )}

      <Content padder>
        <Card>
          <CardItem header bordered>
            <Left>
              {photo === '' ? (
                <Thumbnail
                  source={require('../assets/HYU1.png')}
                  style={{
                    width: 138,
                    height: 138,
                    borderRadius: (138 + 138) / 2,
                  }}
                  large
                />
              ) : (
                <TouchableOpacity onPress={() => setIsOpen(true)}>
                  <Thumbnail
                    source={{ uri: photo }}
                    style={{
                      width: 138,
                      height: 138,
                      borderRadius: (138 + 138) / 2,
                    }}
                    large
                  />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      backgroundColor: 'white',
                      opacity: 0.5,
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      height: 50,
                      width: 138,
                    }}
                  >
                    <Texts
                      style={{
                        color: 'black',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 20,
                      }}
                    >
                      Save Image
                    </Texts>
                  </View>
                </TouchableOpacity>
              )}
            </Left>
            <Right
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => linkEmail(email)}
              >
                <Avatar.Icon
                  icon="email"
                  size={45}
                  color={styles.hanyangColor}
                  theme={{ colors: { primary: '#ffffff' } }}
                />
                <Texts
                  style={
                    Platform.OS === 'ios' ? { fontSize: 14 } : { fontSize: 12 }
                  }
                >
                  Email
                </Texts>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => linkMessage(cellPhone)}
              >
                <Avatar.Icon
                  icon="message-processing"
                  size={45}
                  color="#5592ff"
                  theme={{ colors: { primary: '#ffffff' } }}
                />
                <Texts
                  style={
                    Platform.OS === 'ios' ? { fontSize: 14 } : { fontSize: 12 }
                  }
                >
                  Message
                </Texts>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => callNumber(cellPhone)}
              >
                <Avatar.Icon
                  icon="phone"
                  size={45}
                  color={styles.hanyangColor}
                  theme={{ colors: { primary: '#ffffff' } }}
                />
                <Texts
                  style={
                    Platform.OS === 'ios' ? { fontSize: 14 } : { fontSize: 12 }
                  }
                >
                  Phone
                </Texts>
              </TouchableOpacity>
            </Right>
          </CardItem>
          <CardItem bordered>
            <Content>
              <List>
                <ListItem thumbnail>
                  <Left
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Avatar.Icon
                      icon="account"
                      size={25}
                      color="#ffffff"
                      theme={{ colors: { primary: '#5592ff' } }}
                    />
                    <Text
                      style={
                        Platform.OS === 'ios'
                          ? Platform.OS === 'ios'
                            ? { fontSize: 15, marginLeft: 5 }
                            : { marginLeft: 5 }
                          : { marginLeft: 5 }
                      }
                    >
                      이름
                    </Text>
                  </Left>
                  <Body>
                    <Text>{name}</Text>
                  </Body>
                </ListItem>
                {!birth ? null : (
                  <ListItem thumbnail>
                    <Left
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Avatar.Icon
                        icon="cake"
                        size={25}
                        color="#ffffff"
                        theme={{ colors: { primary: '#5592ff' } }}
                      />

                      <Text
                        style={
                          Platform.OS === 'ios'
                            ? { fontSize: 15, marginLeft: 5 }
                            : { marginLeft: 5 }
                        }
                      >
                        생일
                      </Text>
                    </Left>
                    <Body>
                      <Text>{new Date(birth).format('yyyy-MM-dd')}</Text>
                    </Body>
                  </ListItem>
                )}
                <ListItem thumbnail>
                  <Left
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Avatar.Icon
                      icon="phone"
                      size={25}
                      color="#ffffff"
                      theme={{ colors: { primary: '#5592ff' } }}
                    />
                    <Text
                      allowFontScaling={false}
                      style={
                        Platform.OS === 'ios'
                          ? { fontSize: 15, marginLeft: 5 }
                          : { marginLeft: 5 }
                      }
                    >
                      휴대전화
                    </Text>
                  </Left>
                  <Body>
                    <TouchableOpacity
                      style={{ flexWrap: 'wrap', flex: 1 }}
                      onPress={() =>
                        !cellPhone ? null : callNumber(cellPhone)
                      }
                    >
                      <Text>
                        {!cellPhone ? null : inputPhoneNumber(cellPhone)}
                      </Text>
                    </TouchableOpacity>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Avatar.Icon
                      icon="email"
                      size={25}
                      color="#ffffff"
                      theme={{ colors: { primary: '#5592ff' } }}
                    />
                    <Text
                      style={
                        Platform.OS === 'ios'
                          ? { fontSize: 15, marginLeft: 5 }
                          : { marginLeft: 5 }
                      }
                    >
                      이메일
                    </Text>
                  </Left>
                  <Body>
                    <Text>{email}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Avatar.Icon
                      icon="office-building"
                      size={25}
                      color="#ffffff"
                      theme={{ colors: { primary: '#5592ff' } }}
                    />
                    <Text
                      style={
                        Platform.OS === 'ios'
                          ? { fontSize: 15, marginLeft: 5 }
                          : { marginLeft: 5 }
                      }
                    >
                      회사명
                    </Text>
                  </Left>
                  <Body>
                    <Text>{company}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Avatar.Icon
                      icon="domain"
                      size={25}
                      color="#ffffff"
                      theme={{ colors: { primary: '#5592ff' } }}
                    />
                    <Text
                      style={
                        Platform.OS === 'ios'
                          ? { fontSize: 15, marginLeft: 5 }
                          : { marginLeft: 5 }
                      }
                    >
                      회사주소
                    </Text>
                  </Left>
                  <Body>
                    <Text>{workAddress}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Avatar.Icon
                      icon="deskphone"
                      size={25}
                      color="#ffffff"
                      theme={{ colors: { primary: '#5592ff' } }}
                    />
                    <Text
                      style={
                        Platform.OS === 'ios'
                          ? { fontSize: 15, marginLeft: 5 }
                          : { marginLeft: 5 }
                      }
                    >
                      회사전화
                    </Text>
                  </Left>
                  <Body>
                    <TouchableOpacity
                      style={{ flexWrap: 'wrap', flex: 1 }}
                      onPress={() =>
                        !workPhone ? null : callNumber(workPhone)
                      }
                    >
                      <Text>{workPhone && inputPhoneNumber(workPhone)}</Text>
                    </TouchableOpacity>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Avatar.Icon
                      icon="briefcase-account"
                      size={25}
                      color="#ffffff"
                      theme={{ colors: { primary: '#5592ff' } }}
                    />
                    <Text
                      style={
                        Platform.OS === 'ios'
                          ? { fontSize: 15, marginLeft: 5 }
                          : { marginLeft: 5 }
                      }
                    >
                      부서
                    </Text>
                  </Left>
                  <Body>
                    <Text>{team}</Text>
                  </Body>
                </ListItem>
                <ListItem thumbnail>
                  <Left
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Avatar.Icon
                      icon="medal"
                      size={25}
                      color="#ffffff"
                      theme={{ colors: { primary: '#5592ff' } }}
                    />
                    <Text
                      style={
                        Platform.OS === 'ios'
                          ? { fontSize: 15, marginLeft: 5 }
                          : { marginLeft: 5 }
                      }
                    >
                      직책
                    </Text>
                  </Left>
                  <Body>
                    <Text>{position}</Text>
                  </Body>
                </ListItem>

                <ListItem thumbnail>
                  <Left
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Avatar.Icon
                      icon="star"
                      color="#ffffff"
                      size={25}
                      theme={{ colors: { primary: '#5592ff' } }}
                    />
                    <Text
                      style={
                        Platform.OS === 'ios'
                          ? { fontSize: 15, marginLeft: 5 }
                          : { marginLeft: 5 }
                      }
                    >
                      전공
                    </Text>
                  </Left>
                  <Body>
                    <Text>{major}</Text>
                  </Body>
                </ListItem>
                {!generation ? null : (
                  <ListItem thumbnail>
                    <Left
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Avatar.Icon
                        icon="altimeter"
                        size={25}
                        color="#ffffff"
                        theme={{ colors: { primary: '#5592ff' } }}
                      />

                      <Text
                        style={{
                          fontSize: 15,
                          marginLeft: 5,
                          marginLeft: 5,
                        }}
                      >
                        기수
                      </Text>
                    </Left>
                    <Body>
                      <Text>
                        {generation !== '' ? `${generation}기` : null}
                      </Text>
                    </Body>
                  </ListItem>
                )}

                {Array.isArray(companyDesc) && companyDesc.length !== 0 && (
                  <ListItem
                    style={{ marginTop: 15, marginBottom: 10 }}
                    thumbnail
                  >
                    <Left
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Avatar.Icon
                        icon="briefcase-edit"
                        size={25}
                        color="#ffffff"
                        theme={{ colors: { primary: '#5592ff' } }}
                      />
                      <Text
                        style={
                          Platform.OS === 'ios'
                            ? { fontSize: 15, marginLeft: 5 }
                            : { marginLeft: 5 }
                        }
                      >
                        경력
                      </Text>
                    </Left>
                  </ListItem>
                )}
                {Array.isArray(companyDesc) &&
                  companyDesc.length !== 0 &&
                  companyDesc.map((desc, index) => {
                    return (
                      <ListItem key={index} thumbnail>
                        <Left
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Avatar.Icon
                            icon="checkbox-multiple-marked-circle"
                            color="#5592ff"
                            size={25}
                            theme={{ colors: { primary: '#ffffff' } }}
                          />
                        </Left>

                        <Body>
                          <Text style={{ fontSize: 15 }}>{desc}</Text>
                        </Body>
                      </ListItem>
                    );
                  })}
              </List>
            </Content>
          </CardItem>
        </Card>
      </Content>
    </View>
  );
};
