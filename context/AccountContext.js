import React, { createContext, useEffect, useState } from 'react';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [wallet, setWallet] = useState('');
  useEffect(() => {
    const storedAccount = localStorage.getItem('ACCOUNT_DEMASK');
    const storedWallet = localStorage.getItem('WALLET_DEMASK');
    if (storedAccount) {
      setAccount(storedAccount);
    }
    if (storedWallet) {
      setWallet(storedWallet);
    }
  }, [account]);

  const updateAccount = (newAccount) => {
    setAccount(newAccount);
    localStorage.setItem('ACCOUNT_DEMASK', newAccount);
  };

  const updateWallet = (newWallet) => {
    setWallet(newWallet);
    localStorage.setItem('WALLET_DEMASK', newWallet);
  };
  return (
    <AccountContext.Provider value={{ account, updateAccount, updateWallet,wallet }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;