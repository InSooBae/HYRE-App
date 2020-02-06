import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
import Profile from '../screens/Profile';
import Search from '../screens/Search';

const TabNavigation = createBottomTabNavigator({
  Home,
  Notifications,
  Add: {
    screen: View,
    navigationOptions: {
      tabBarOnPress: () => {
        console.log('Add');
      }
    }
  },
  Profile,
  Search
});

export default createAppContainer(TabNavigation);
