import { createSlice } from "@reduxjs/toolkit";
interface ProfileState {
  accessToken: string;
  isLoggedIn: boolean;
  user: string;
  profile: UserInterface;
}
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    accessToken: "",
    isLoggedIn: false,
    user: "",
    profile: {},
  },
  reducers: {
    login: (state, { payload }) => {
      const { accessToken, user } = payload;
      state.accessToken = accessToken;
      state.user = user?.toLowerCase();
      state.isLoggedIn = true;
      localStorage.setItem("PROFILE", JSON.stringify(payload));
    },
    logout: (state) => {
      localStorage.removeItem("PROFILE");
      state.accessToken = "";
      state.user = "";
      state.isLoggedIn = false;
    },
    userData: (state, { payload }) => {
      const { profile } = payload;
      state.profile = profile;
    },
  },
});
export const { login, logout, userData } = profileSlice.actions;
export const selectProfile = (state: any): ProfileState => state.profile;
export default profileSlice.reducer;
