import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

export const fetchTaskReports = createAsyncThunk(
  "taskReports/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/task-reports");
      // The API returns data in response.data.data.data (paginated structure)
      const rawData = response.data.data.data || [];
      
      // Transform snake_case from API to camelCase for frontend consistency
      return rawData.map(item => ({
        id: item.id,
        employee_id: item.employee_id,
        date: item.date,
        employee: item.employee 
          ? `${item.employee.first_name || ""} ${item.employee.last_name || ""}`.trim() 
          : "N/A",
        tasksCompleted: item.tasks_completed || "",
        planForTomorrow: item.plan_tomorrow || "",
        remarks: item.remarks || "",
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch task reports");
    }
  }
);

export const addTaskReport = createAsyncThunk(
  "taskReports/add",
  async (reportData, { rejectWithValue }) => {
    try {
      // Map camelCase back to snake_case for the API
      const apiData = {
        date: reportData.date,
        tasks_completed: reportData.tasksCompleted,
        plan_tomorrow: reportData.planForTomorrow,
        remarks: reportData.remarks,
        employee_id: reportData.employeeId, // Assuming this is needed for add
      };
      const response = await apiClient.post("/admin/task-reports", apiData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add task report");
    }
  }
);

export const updateTaskReport = createAsyncThunk(
  "taskReports/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const apiData = {
        date: data.date,
        tasks_completed: data.tasksCompleted,
        plan_tomorrow: data.planForTomorrow,
        remarks: data.remarks,
      };
      const response = await apiClient.put(`/admin/task-reports/${id}`, apiData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update task report");
    }
  }
);

export const deleteTaskReport = createAsyncThunk(
  "taskReports/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/task-reports/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete task report");
    }
  }
);

const taskReportSlice = createSlice({
  name: "taskReports",
  initialState: {
    taskReports: [],
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Task Reports
      .addCase(fetchTaskReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskReports.fulfilled, (state, action) => {
        state.loading = false;
        state.taskReports = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchTaskReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Task Report
      .addCase(addTaskReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTaskReport.fulfilled, (state, action) => {
        state.loading = false;
        // Transform the new report back to camelCase if it's snake_case from API
        const item = action.payload;
        const transformedReport = {
          id: item.id,
          employee_id: item.employee_id,
          date: item.date,
          employee: item.employee 
            ? `${item.employee.first_name || ""} ${item.employee.last_name || ""}`.trim() 
            : "N/A",
          tasksCompleted: item.tasks_completed || "",
          planForTomorrow: item.plan_tomorrow || "",
          remarks: item.remarks || "",
        };
        state.taskReports.unshift(transformedReport);
        state.totalCount += 1;
      })
      .addCase(addTaskReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Task Report
      .addCase(updateTaskReport.fulfilled, (state, action) => {
        const item = action.payload;
        const index = state.taskReports.findIndex(r => r.id === item.id);
        if (index !== -1) {
          state.taskReports[index] = {
            id: item.id,
            employee_id: item.employee_id,
            date: item.date,
            employee: item.employee 
              ? `${item.employee.first_name || ""} ${item.employee.last_name || ""}`.trim() 
              : state.taskReports[index].employee,
            tasksCompleted: item.tasks_completed || "",
            planForTomorrow: item.plan_tomorrow || "",
            remarks: item.remarks || "",
          };
        }
      })
      // Delete Task Report
      .addCase(deleteTaskReport.fulfilled, (state, action) => {
        state.taskReports = state.taskReports.filter(r => r.id !== action.payload);
        state.totalCount -= 1;
      });
  },
});

export const { clearError } = taskReportSlice.actions;
export default taskReportSlice.reducer;