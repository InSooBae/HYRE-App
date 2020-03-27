import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Contacts from '../screens/Tabs/Contacts';
import Notices from '../screens/Tabs/Notices';
import Setting from '../screens/Tabs/Setting';
import { Image, View, Platform } from 'react-native';
import styles from '../styles';
import { stackStyles } from './config';
import NavIcon from '../components/NavIcon';
import UserDetail from '../screens/UserDetail';
import NoticeDetail from '../screens/NoticeDetail';
import Prof from '../screens/Tabs/Prof';
import Search from '../screens/Search';
import Director from '../screens/Tabs/Director';
import SearchLink from '../components/SearchLink';
import { IconButton } from 'react-native-paper';
import Text from '../Text';

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
          title: (
            <Text
              style={
                Platform.OS === 'ios'
                  ? {
                      fontSize: 17,
                      fontWeight: '700',
                      fontFamily: 'lotte-medium'
                    }
                  : {
                      fontSize: 17,
                      fontWeight: '700',
                      fontFamily: 'lotte-medium'
                    }
              }
            >
              {navigation.getParam('name')}
            </Text>
          ),
          headerTitleAlign: 'center' | 'left'
        })
      },
      NoticeDetail: {
        screen: NoticeDetail,
        navigationOptions: () => ({
          headerTitle: () => (
            <Text
              style={
                Platform.OS === 'ios'
                  ? {
                      fontSize: 17,
                      fontWeight: '700',
                      fontFamily: 'lotte-bold'
                    }
                  : {
                      fontSize: 17,
                      fontWeight: '700',
                      fontFamily: 'lotte-bold'
                    }
              }
            >
              공지사항
            </Text>
          ),
          headerTitleAlign: 'center' | 'left'
        })
      },
      Search: {
        screen: Search,
        navigationOptions: ({ navigation }) => ({
          headerLeft: () => (
            <IconButton
              icon="chevron-left"
              color="#E0E0E0"
              size={40}
              onPress={() => navigation.goBack(null)}
            />
          ),
          headerStyle: {
            backgroundColor: '#F0F0F0'
          }
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
      screen: stackFactory(Notices, {
        headerTitle: () => (
          <Text
            style={
              Platform.OS === 'ios'
                ? {
                    fontSize: 17,
                    fontWeight: '700',
                    fontFamily: 'lotte-bold'
                  }
                : {
                    fontSize: 17,
                    fontWeight: '700',
                    fontFamily: 'lotte-bold'
                  }
            }
          >
            공지사항
          </Text>
        )
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'newspaper-o' : 'newspaper-o'}
          />
        ),
        tabBarLabel: ({ focused }) => (
          <Text
            style={
              Platform.OS === 'ios'
                ? focused
                  ? {
                      fontSize: 12,
                      fontFamily: 'lotte-medium',
                      color: 'white'
                    }
                  : {
                      fontSize: 12,
                      fontFamily: 'lotte-medium',
                      color: '#a6a6a6'
                    }
                : focused
                ? {
                    fontSize: 12,
                    color: 'white',
                    fontFamily: 'lotte-medium'
                  }
                : {
                    fontSize: 12,
                    color: '#a6a6a6',
                    fontFamily: 'lotte-medium'
                  }
            }
          >
            공지사항
          </Text>
        )
      }
    },
    Prof: {
      screen: stackFactory(Prof, {
        headerTitle: () => (
          <Text
            style={
              Platform.OS === 'ios'
                ? { fontSize: 17, fontWeight: '700' }
                : { fontSize: 17, fontWeight: '700' }
            }
          >
            교수
          </Text>
        )
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'graduation-cap' : 'graduation-cap'}
          />
        ),
        tabBarLabel: ({ focused }) => (
          <Text
            style={
              Platform.OS === 'ios'
                ? focused
                  ? {
                      fontSize: 12,
                      fontFamily: 'lotte-medium',
                      color: 'white'
                    }
                  : {
                      fontSize: 12,
                      fontFamily: 'lotte-medium',
                      color: '#a6a6a6'
                    }
                : focused
                ? {
                    fontSize: 12,
                    color: 'white',
                    fontFamily: 'lotte-medium'
                  }
                : {
                    fontSize: 12,
                    color: '#a6a6a6',
                    fontFamily: 'lotte-medium'
                  }
            }
          >
            교수
          </Text>
        )
      }
    },
    Contacts: {
      screen: stackFactory(Contacts, {
        headerTitle: () => (
          <View>
            <Image
              style={{
                height: 45
              }}
              resizeMode="contain"
              source={require('../assets/HYU2.png')}
            />
          </View>
        ),
        headerRight: () => <SearchLink />
      }),

      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            size={21}
            focused={focused}
            name={Platform.OS === 'ios' ? 'address-card' : 'address-card'}
          />
        ),
        tabBarLabel: ({ focused }) => (
          <Text
            style={
              Platform.OS === 'ios'
                ? focused
                  ? {
                      fontSize: 12,
                      fontFamily: 'lotte-medium',
                      color: 'white'
                    }
                  : {
                      fontSize: 12,
                      fontFamily: 'lotte-medium',
                      color: '#a6a6a6'
                    }
                : focused
                ? {
                    fontSize: 12,
                    color: 'white',
                    fontFamily: 'lotte-medium'
                  }
                : {
                    fontSize: 12,
                    color: '#a6a6a6',
                    fontFamily: 'lotte-medium'
                  }
            }
          >
            연락처
          </Text>
        )
      }
    },

    Director: {
      screen: stackFactory(Director, {
        headerTitle: () => (
          <Text
            style={
              Platform.OS === 'ios'
                ? { fontSize: 17, fontWeight: '700' }
                : { fontSize: 17, fontWeight: '700' }
            }
          >
            원우회
          </Text>
        )
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'institution' : 'institution'}
          />
        ),
        tabBarLabel: ({ focused }) => (
          <Text
            style={
              Platform.OS === 'ios'
                ? focused
                  ? {
                      fontSize: 12,
                      fontFamily: 'lotte-medium',
                      color: 'white'
                    }
                  : {
                      fontSize: 12,
                      fontFamily: 'lotte-medium',
                      color: '#a6a6a6'
                    }
                : focused
                ? {
                    fontSize: 12,
                    color: 'white',
                    fontFamily: 'lotte-medium'
                  }
                : {
                    fontSize: 12,
                    color: '#a6a6a6',
                    fontFamily: 'lotte-medium'
                  }
            }
          >
            공지사항
          </Text>
        )
      }
    },
    Profile: {
      screen: stackFactory(Setting, {
        headerTitle: () => (
          <Text
            style={
              Platform.OS === 'ios'
                ? { fontSize: 17, fontWeight: '700' }
                : { fontSize: 17, fontWeight: '700' }
            }
          >
            내 정보
          </Text>
        )
      }),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <NavIcon
            size={22}
            focused={focused}
            name={Platform.OS === 'ios' ? 'user-circle' : 'user-circle'}
          />
        ),
        tabBarLabel: ({ focused }) => (
          <Text
            style={
              Platform.OS === 'ios'
                ? focused
                  ? {
                      fontSize: 12,
                      fontFamily: 'lotte-medium',
                      color: 'white'
                    }
                  : {
                      fontSize: 12,
                      fontFamily: 'lotte-medium',
                      color: '#a6a6a6'
                    }
                : focused
                ? {
                    fontSize: 12,
                    color: 'white',
                    fontFamily: 'lotte-medium'
                  }
                : {
                    fontSize: 12,
                    color: '#a6a6a6',
                    fontFamily: 'lotte-medium'
                  }
            }
          >
            내정보
          </Text>
        )
      }
    }
  },
  Platform.OS === 'ios'
    ? {
        initialRouteName: 'Notice',
        tabBarPosition: 'bottom',
        tabBarOptions: {
          indicatorStyle: {
            backgroundColor: styles.blackColor,
            marginBottom: 10
          },
          style: {
            ...stackStyles,
            backgroundColor: styles.hanyangColor,
            paddingBottom: 5
          },
          showIcon: true,
          showLabel: true
        }
      }
    : {
        initialRouteName: 'Notice',
        tabBarPosition: 'bottom',
        tabBarOptions: {
          indicatorStyle: {
            backgroundColor: styles.blackColor,
            marginBottom: 5
          },
          style: {
            ...stackStyles,
            backgroundColor: styles.hanyangColor
          },
          showIcon: true,
          showLabel: true
        }
      }
);

export default createAppContainer(TabNavigation);
