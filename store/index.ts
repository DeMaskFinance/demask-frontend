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
import storage from 'redux-persist/lib/storage'

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
