import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
context를 object라고 상상(함수,변수를포함하는) -> 
context에 접근하고 싶어하는 모든 components가 context provider안에 있는한 context에 어디든지 접근가능
그래서 components들을 <AuthContext.Provider> 이안에다가 다 둘예정 -><AuthProvider>

context는 obj인데 이건 useContext를 써서 어디서든 접근가능함
*/
export const AuthContext = createContext();

export const AuthProvider = ({ isLoggedIn: isLoggedInProp, children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp);
  //로그인 성공
  const logUserIn = async token => {
    try {
      //string으로 보내야 오류안남 걍 true하면 튕김
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('jwt', token);
      await AsyncStorage.setItem('isPopUp', '{"result":true,"expireAt":null}');
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
    }
  };

  //로그인 실패
  const logUserOut = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'false');
      await AsyncStorage.setItem('isPopUp', '{"result":true,"expireAt":null}');
      setIsLoggedIn(false);
    } catch (e) {
      console.log(e);
    }
  };

  const laterPopUp = async createdAt => {
    let data = {};
    const now = new Date(createdAt);
    // let expireTime = new Date(now);
    // expireTime.setHours(now.getHours() + 168);
    try {
      const a = await AsyncStorage.getItem('isPopUp', async (err, value) => {
        data.result = false;
        data.expireAt = now;
        await AsyncStorage.mergeItem('isPopUp', JSON.stringify(data));
      });
      console.log(a);
    } catch (e) {
      console.log(e);
    }
  };

  const popUp = async createdAt => {
    let data = null;
    try {
      await AsyncStorage.getItem('isPopUp', async (err, value) => {
        data = JSON.parse(value);
        // there is data in cache && cache is expired
        if (
          data !== null &&
          data['expireAt'] &&
          new Date(data.expireAt) < new Date(createdAt)
        ) {
          //clear cache
          AsyncStorage.removeItem('isPopUp');
          //update res to be null
          data = null;
        } else {
          console.log('read data from cache  ');
        }
      });
    } catch (e) {
      console.log(e);
    }
    //처음 setItem할때
    if (data === null) {
      //fetch data
      try {
        await AsyncStorage.setItem(
          'isPopUp',
          '{"result":true,"expireAt":null}'
        );
      } catch (e) {
        console.log(e);
      }
    }
  };
  //객체로 한방에 넘기고 isLoggedIn은 NavController logUserIn,logUserOut은 나중에 스크린에서
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, logUserIn, logUserOut, popUp, laterPopUp }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//이케 한번 꺼내놓고 다른곳에서 불러서 쓰면 1개만 부르고 여러개 이용가능!
export const useIsLoggedIn = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn;
};

export const useLogIn = () => {
  const { logUserIn } = useContext(AuthContext);
  return logUserIn;
};

export const useLogOut = () => {
  const { logUserOut } = useContext(AuthContext);
  return logUserOut;
};

export const usePopUp = () => {
  const { popUp } = useContext(AuthContext);
  return popUp;
};

export const useLaterPopUp = () => {
  const { laterPopUp } = useContext(AuthContext);
  return laterPopUp;
};
