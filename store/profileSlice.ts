import { createSlice } from "@reduxjs/toolkit";
interface ProfileState {
  accessToken: string;
  isLoggedIn: boolean;
  user: string;
  profile: {
    name?: string;
    username?: string;
    email?: string;
    avatar?: string;
    socials?: Socials;
    cover?: string;
    about?: string;
    id?: string;
    createdAt?: Date;
    updatedAt?: Date | null;
  };
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
      localStorage.setItem("profile", JSON.stringify(payload));
    },
    logout: (state) => {
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
