import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", {
        username: email,
        password,
      });

      const data = response.data.data;

      localStorage.setItem("hr-token", data.access_token);
      localStorage.setItem("hr-user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const nameParts = profileData.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("name", profileData.fullName); 
      formData.append("username", profileData.fullName); 
      formData.append("email", profileData.email);
      
      if (profileData.profileImage) {
        formData.append("avatar", profileData.profileImage);
      }
      
      const response = await apiClient.post("/employee/update-profile", formData);
      
      const updatedUser = response.data.data;
      localStorage.setItem("hr-user", JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/employee/change-password", {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // Handle Laravel validation errors
        const errors = error.response.data.errors;
        const message = errors ? Object.values(errors).flat()[0] : error.response.data.message;
        return rejectWithValue(message || "Validation failed");
      }
      return rejectWithValue(error.response?.data?.message || "Failed to change password");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("hr-token");
  localStorage.removeItem("hr-user");
  return null;
});

const initialState = {
  user: JSON.parse(localStorage.getItem("hr-user")) || null,
  token: localStorage.getItem("hr-token") || null,
  isAuthenticated: !!localStorage.getItem("hr-token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const user = action.payload.user;

        state.user = {
          ...user,
          name: user.employee?.name || (user.employee?.first_name ? `${user.employee.first_name} ${user.employee.last_name || ''}`.trim() : user.name),
          avatar: user.employee?.avatar 
            ? `${import.meta.env.VITE_API_URL?.replace("/api", "") || ""}/storage/${user.employee.avatar}`
            : (user.avatar || "https://violet-leopard-500489.hostingersite.com/hr/public/storage/avatars/jnBiWzD1Lt4YMtHS4hK2CS0Pcbo3vSOZw7Xd6px4.jpg"),
        };

        state.token = action.payload.access_token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload;
        state.user = {
          ...user,
          name: user.employee?.name || (user.employee?.first_name ? `${user.employee.first_name} ${user.employee.last_name || ''}`.trim() : user.name),
          avatar: user.employee?.avatar 
            ? `${import.meta.env.VITE_API_URL?.replace("/api", "") || ""}/storage/${user.employee.avatar}`
            : (user.avatar || "https://violet-leopard-500489.hostingersite.com/hr/public/storage/avatars/jnBiWzD1Lt4YMtHS4hK2CS0Pcbo3vSOZw7Xd6px4.jpg"),
        };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
