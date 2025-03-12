import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("PROFILE");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    console.error("Failed to load state", err);
    return undefined;
  }
};

const saveState = (state: any) => {
  try {
    if (state.accessToken) {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("PROFILE", serializedState);
    }
  } catch (err) {
    console.error("Failed to save state", err);
  }
};

const preloadedState = { profile: loadState() || {} };

const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState().profile);
});

export default store;
