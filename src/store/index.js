import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import employeeReducer from "./slices/employeeSlice"
import notificationReducer from "./slices/notificationSlice"
import organizationReducer from "./slices/organizationSlice"
import agreementReducer from "./slices/agreementsSlice"
import attendanceReducer from "./slices/attendanceSlice"
import leaveReducer from "./slices/leaveSlice"
import designationReducer from "./slices/designationSlice"
import taskReportReducer from './slices/taskReportSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        employees: employeeReducer,
        notifications: notificationReducer,
        organizations: organizationReducer,
        agreements: agreementReducer,
        attendance: attendanceReducer,
        leaves: leaveReducer,
        designations: designationReducer,
        taskReports: taskReportReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})