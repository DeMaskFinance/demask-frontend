import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
const createNoopStorage = () => {
  return {
     getItem(_key: any) {
        return Promise.resolve(null);
     },
     setItem(_key: any, value: any) {
        return Promise.resolve(value);
     },
     removeItem(_key: any) {
        return Promise.resolve();
     },
  };
};
const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();
const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducerProfile = persistReducer(persistConfig, profileReducer);
const store = configureStore({
  reducer: {
    profile: persistedReducerProfile
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
export default store;
export const persistor = persistStore(store)
