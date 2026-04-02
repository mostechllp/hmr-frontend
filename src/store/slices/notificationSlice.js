import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    { id: 1, title: "The document 'file' is expiring on 2026-04-22.", time: "1 day ago", read: false, type: "expiry" },
    { id: 2, title: "SENTHIL is absent today.", time: "2 days ago", read: false, type: "absent" },
    { id: 3, title: "KATE is absent today.", time: "2 days ago", read: false, type: "absent" },
    { id: 4, title: "AKSHAY is absent today.", time: "2 days ago", read: false, type: "absent" },
  ],
  unreadCount: 4,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
  },
});

export const { markAsRead, markAllRead, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;