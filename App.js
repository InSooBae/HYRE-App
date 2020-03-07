import React, { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { AsyncStorage } from 'react-native';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import ApolloClient from 'apollo-boost';
import { ThemeProvider } from 'styled-components';
import { Provider as PaperProvider } from 'react-native-paper';
import { ApolloProvider } from '@apollo/react-hooks';
import apolloClientOptions from './apollo';
import styles from './styles';
import { Root } from 'native-base';

import NavController from './components/NavController';
import { AuthProvider } from './AuthContext';
// apollo cache persist가 local estate안에서 기본을 잘 동작하지 못함. context로 고침?
//모든 apollo관련된 생성은 app.js에서 일어나게함

//앱로딩은 기본적으로 return했을때 앱이 계속해서 로딩하는 component (uploading)대충 아직 로딩 다안될때 쓴다

export default function App() {
  //preload가 다 됬는지 안됬는지 확인
  const [loaded, setLoaded] = useState(false);
  //apollo client (object 는 null로 둠)
  const [client, setClient] = useState(null);
  //유저가 로그아웃했는지 알려고 null은 로그아웃했는지 체크 x false는 로그아웃 true는 로그인
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const _cacheSplashResourcesAsync = async () => {
    const gif = require('./assets/HYU2.png');
    return Asset.fromModule(gif).downloadAsync();
  };
  const preLoad = async () => {
    //preload때 AsyncStorage 비우기 -> 로그아웃
    try {
      //처음 icon의 font를 load
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...FontAwesome.font
      });
      //다음은 Asset(이미지)으로 loading
      //만약 여러개 해야하면 Asset.loadAsync([require('path'),require('path'),..])
      await Asset.loadAsync([
        require('./assets/HYU1.png'),
        require('./assets/HYU2.png')
      ]);
      //apollo memory에 있는 cache를 사용해서 새로운 cache를 만들어냄
      //기본으론 apollo boost는 memory에 있는 cache로 생겨나는데 이경우는 expose해야함 이유는 아래 persistCache
      const cache = new InMemoryCache();

      //  persist cache는 memory cache에 있는 cache를 가져오는건데 이건 비어있음 그리고 persist cache는 폰에있는 AsyncStorage를 본다.
      // await before instantiating ApolloClient, else queries might run before the cache is persisted
      await persistCache({
        cache,
        //웹사이트의 local storage랑 비슷함 app의 예전 복사본을 찾으면 cache로 다시 그걸 넣음
        storage: AsyncStorage
      });
      // 다음으로 apollo client를 persist한 캐시와 함께 만들고 apolloClientOptions의 option들도 보냄
      // Continue setting up Apollo as usual. ApolloClient는 옵션이 많음 apollo.js에서 설정할예정
      const client = new ApolloClient({
        cache,
        //요청할때마다 이함수가 실행하게됨
        request: async operation => {
          //아직 토큰이 없어서 생성
          const token = await AsyncStorage.getItem('jwt');
          //operation으로 할수있는게 많고 operation.setContext는 operation의 context를 조절하는 함수임
          return operation.setContext({
            headers: { Authorization: `Bearer ${token}` }
          });
        },
        ...apolloClientOptions
      });

      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (!isLoggedIn || isLoggedIn === 'false') {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      //위 작업들을 위해 동기화 작업 필요 모든게 다되면 loaded false->true client null-> client
      setLoaded(true);
      setClient(client);
      SplashScreen.hide();
    } catch (e) {
      console.log(e);
    }
  };
  //1.mount가 될때 useEffect 함수를 사용하는건데 이함수는 preload(){비동기적함수}를 가지고있고
  useEffect(() => {
    preLoad();
  }, []);
  // 처음 component가 mount 되면 loaded는 false,client는 null이됨 -> <AppLoading>
  // !isLoggedIn 요케해두면 false, undefined, null 인상태에서 다동작됨 -> null이랑 비교(체크하면 false or true)

  // 아직은 뭔지 모르겠는데 context는 위 두함수를 모든곳에서 사용할수있게해줌

  return loaded && client && isLoggedIn !== null ? (
    //loaded,client가 둘다 true or exist 면 client를 ApolloProvider에게 pass
    //AuthProvider가 감싸야 context이용가능 AuthContext에 설명
    <Root>
      <ApolloProvider client={client}>
        <ThemeProvider theme={styles}>
          <PaperProvider>
            <AuthProvider isLoggedIn={isLoggedIn}>
              <NavController />
            </AuthProvider>
          </PaperProvider>
        </ThemeProvider>
      </ApolloProvider>
    </Root>
  ) : (
    //Apploading은 render를 하면 app의 splash screen을 render를 멈출때 까지 upfront해주는 component
    <AppLoading
      startAsync={_cacheSplashResourcesAsync}
      onFinish={() => null}
      autoHideSplash={false}
    />
  );
}
