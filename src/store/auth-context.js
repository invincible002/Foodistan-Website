import { useState, useCallback, createContext, useEffect } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  cartId: '',
  phoneNumber: '',
  login: (userData) => {},
  logout: () => {},
});

let logoutTimer;
const AuthProvider = (props) => {
  const [cartId, setCartId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expiration, setExpiration] = useState();

  const login = useCallback((userData, expTime) => {
    setCartId(userData.cartId);
    setPhoneNumber(userData.phoneNumber);

    const expirationTime =
      new Date(new Date().getTime() + 1000 * 60 * 60 * 2) || expTime;

    setExpiration(expirationTime);

    localStorage.setItem(
      'user',
      JSON.stringify({
        ...userData,
        expirationTime: expirationTime.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setCartId('');
    setPhoneNumber('');
    setExpiration(null);
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (
      userData &&
      userData.cartId &&
      new Date(userData.expirationTime) > new Date()
    ) {
      login(userData, new Date(userData.expiration));
    }
  }, [login]);

  useEffect(() => {
    if (cartId && expiration) {
      const remainingTime = expiration.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [cartId, expiration, logout]);

  const authValue = {
    isLoggedIn: !!cartId && !!phoneNumber,
    cartId,
    phoneNumber,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
