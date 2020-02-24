import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Contacts from '../screens/Contacts';
import Notice from '../screens/Notice';
import Search from '../screens/Search';
import Prof from '../screens/Prof';
import Setting from '../screens/Setting';
import { Image, View } from 'react-native';
import styles from '../styles';
import { stackStyles } from './config';
import { Button, Icon, Text } from 'native-base';

//TabNavigator에 각 탭마다 StackNavigator효과를 주는일 customconfig에는설정들
const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      InitialRoute: {
        screen: initialRoute,
        navigationOptions: { ...customConfig }
      }
    },
    { headerLayoutPreset: 'center' | 'left' }
  );

const TabNavigation = createMaterialTopTabNavigator(
  {
    Notice: {
      screen: stackFactory(Notice, {
        headerLayoutPreset: 'center'
        // headerTitle: () => (
        //   <Image
        //     style={{}}
        //     resizeMode="contain"
        //     source={require('../assets/HYU_logo1.png')}
        //   />
        // )
      })
    },
    Search: {
      screen: stackFactory(Search, {
        title: '검색'
      })
    },
    Contacts: {
      screen: stackFactory(Contacts, {
        headerTitle: () => (
          <View>
            <Image
              style={{
                height: 50
              }}
              resizeMode="contain"
              source={require('../assets/HYU_logo1.png')}
            />
          </View>
        )
      }),
      navigationOptions: {
        tabBarIcon: () => (
          <Button vertical>
            <Icon name="person" />
            <Text>Contact</Text>
          </Button>
        )
      }
    },
    Prof: {
      screen: stackFactory(Prof, {
        title: '교수 / 국장'
      })
    },
    Profile: {
      screen: stackFactory(Setting, {
        title: '설정',
        headerTitle: () => (
          <Image
            style={{ height: 50 }}
            resizeMode="contain"
            source={require('../assets/HYU_logo1.png')}
          />
        )
      })
    }
  },
  {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: styles.blackColor,
        marginBottom: 20
      },
      labelStyle: {
        color: styles.blackColor,
        fontWeight: '600'
      },
      style: {
        paddingBottom: 20,
        ...stackStyles
      },
      showIcon: true,
      showLabel: false
    }
  }
);

export default createAppContainer(TabNavigation);
