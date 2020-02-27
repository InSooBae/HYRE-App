import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Contacts from '../screens/Tabs/Contacts';
import Notice from '../screens/Tabs/Notice';
import Search from '../screens/Tabs/Search';
import Setting from '../screens/Tabs/Setting';
import { Image, View, Platform } from 'react-native';
import styles from '../styles';
import { stackStyles } from './config';
import NavIcon from '../components/NavIcon';
import UserDetail from '../screens/UserDetail';
import Prof from '../screens/Tabs/Prof';

//TabNavigator에 각 탭마다 StackNavigator효과를 주는일 customconfig에는설정들
const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      InitialRoute: {
        screen: initialRoute,
        navigationOptions: {
          ...customConfig,
          headerTitleAlign: 'center' | 'left'
        }
      },
      UserDetail: {
        screen: UserDetail,
        navigationOptions: ({ navigation }) => ({
          title: navigation.getParam('name')
        })
      }
    },
    {
      defaultNavigationOptions: {
        headerBackTitle: null,
        headerBackTitleVisible: false,
        headerTintColor: styles.blackColor,
        headerStyle: { ...stackStyles }
      }
    }
  );

const TabNavigation = createMaterialTopTabNavigator(
  {
    Notice: {
      screen: stackFactory(Notice, {}),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'newspaper-o' : 'newspaper-o'}
          />
        )
      }
    },
    Search: {
      screen: stackFactory(Search, {
        title: '검색'
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'search' : 'search'}
          />
        )
      }
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
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'address-card' : 'address-card'}
          />
        )
      }
    },
    Prof: {
      screen: stackFactory(Prof, {}),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'graduation-cap' : 'graduation-cap'}
          />
        )
      }
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
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'gear' : 'gear'}
          />
        )
      }
    }
  },
  {
    initialRouteName: 'Contacts',
    tabBarPosition: 'bottom',
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: styles.blackColor,
        marginBottom: 20
      },
      style: {
        paddingBottom: 20,
        ...stackStyles,
        backgroundColor: styles.hanyangColor
      },
      showIcon: true,
      showLabel: false
    }
  }
);

export default createAppContainer(TabNavigation);
