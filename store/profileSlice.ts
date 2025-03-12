import { createSlice } from "@reduxjs/toolkit";

interface ProfileState {
  accessToken: string;
  isLoggedIn: boolean;
  user: string;
  profile: Record<string, any>;
}

const initialState: ProfileState = {
  accessToken: "",
  isLoggedIn: false,
  user: "",
  profile: {},
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      const { accessToken, user } = payload;
      state.accessToken = accessToken;
      state.user = user?.toLowerCase();
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.accessToken = "";
      state.user = "";
      state.isLoggedIn = false;
      localStorage.removeItem("PROFILE");
    },
    userData: (state, { payload }) => {
      state.profile = payload.profile;
    },
  },
});

export const { login, logout, userData } = profileSlice.actions;
export const selectProfile = (state: any): ProfileState => state.profile;
export default profileSlice.reducer;
