import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import employeeReducer from "./slices/employeeSlice"
import notificationReducer from "./slices/notificationSlice"
import organizationReducer from "./slices/organizationSlice"
import companyReducer from "./slices/companySlice";
import agreementReducer from "./slices/agreementsSlice"
import attendanceReducer from "./slices/attendanceSlice"
import leaveReducer from "./slices/LeaveSlice"
import designationReducer from "./slices/designationSlice"
import taskReportReducer from './slices/taskReportSlice';
import dashboardReducer from "./slices/dashboardSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        employees: employeeReducer,
        notifications: notificationReducer,
        organizations: organizationReducer,
        companies: companyReducer,
        agreements: agreementReducer,
        attendance: attendanceReducer,
        leaves: leaveReducer,
        designations: designationReducer,
        taskReports: taskReportReducer,
        dashboard: dashboardReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})