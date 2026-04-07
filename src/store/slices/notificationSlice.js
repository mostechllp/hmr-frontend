import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/admin/notifications");
      return res.data.data; // 👈 array
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  },
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload,
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = (action.payload || []).map((n) => ({
          ...n,
          read: n.read ?? false,
        }));

        // calculate unread
        state.unreadCount = state.notifications.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { markAsRead, markAllRead, addNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
