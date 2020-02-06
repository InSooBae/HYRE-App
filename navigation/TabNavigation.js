import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Contacts from '../screens/Contacts';
import Notice from '../screens/Notice';
import Search from '../screens/Search';
import Prof from '../screens/Prof';
import Setting from '../screens/Setting';

//TabNavigator에 각 탭마다 StackNavigator효과를 주는일 customconfig에는설정들
const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator({
    InitialRoute: {
      screen: initialRoute,
      navigationOptions: { ...customConfig }
    }
  });

const TabNavigation = createBottomTabNavigator({
  Notice: {
    screen: stackFactory(Notice, {
      title: '공지사항'
    })
  },
  Search: {
    screen: stackFactory(Search, {
      title: '검색'
    })
  },
  Contacts: {
    screen: stackFactory(Contacts, {
      title: '연락처'
    })
  },
  Prof: {
    screen: stackFactory(Prof, {
      title: '교수 / 국장'
    })
  },
  Profile: {
    screen: stackFactory(Setting, {
      title: '설정'
    })
  }
});

export default createAppContainer(TabNavigation);
