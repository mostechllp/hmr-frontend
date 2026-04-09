import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

// Async thunks for admin leave management
export const fetchLeaves = createAsyncThunk(
  "leaves/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/leaves");
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave requests"
      );
    }
  }
);

export const fetchLeaveById = createAsyncThunk(
  "leaves/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/leaves/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave request"
      );
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  "leaves/updateStatus",
  async ({ id, status, processedBy, rejection_reason }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/admin/leaves/${id}/status`, {
        status,
        processed_by: processedBy,
        rejection_reason: rejection_reason || null
      });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update leave status"
      );
    }
  }
);

// Leave Types
export const fetchLeaveTypes = createAsyncThunk(
  "leaves/fetchTypes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/admin/leave-types");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch leave types",
      );
    }
  }
);

export const addLeaveType = createAsyncThunk(
  "leaves/addType",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/admin/leave-types", data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add leave type",
      );
    }
  }
);

export const updateLeaveType = createAsyncThunk(
  "leaves/updateType",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/admin/leave-types/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update leave type",
      );
    }
  }
);

export const deleteLeaveType = createAsyncThunk(
  "leaves/deleteType",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/leave-types/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete leave type",
      );
    }
  }
);

export const updateLeaveTypeStatus = createAsyncThunk(
  "leaves/updateTypeStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/admin/leave-types/${id}/status`, {
        status,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status",
      );
    }
  }
);

export const toggleLeaveTypeStatus = createAsyncThunk(
  "leaves/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/admin/leave-types/${id}/status`,
        { status }
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const leaveSlice = createSlice({
  name: "leaves",
  initialState: {
    leaves: [],
    currentLeave: null,
    leaveTypes: [],
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLeave: (state) => {
      state.currentLeave = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leaves
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
        state.totalCount = action.payload?.length || 0;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      // Fetch leave by ID
      .addCase(fetchLeaveById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLeave = action.payload;
      })
      .addCase(fetchLeaveById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      // Update leave status
      .addCase(updateLeaveStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedLeave = action.payload;
        const index = state.leaves.findIndex((l) => l.id === updatedLeave.id);
        if (index !== -1) {
          state.leaves[index] = updatedLeave;
        }
        if (state.currentLeave?.id === updatedLeave.id) {
          state.currentLeave = updatedLeave;
        }
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      // Fetch leave types
      .addCase(fetchLeaveTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypes = action.payload.map((type) => ({
          id: type.id,
          name: type.name,
          status: type.status === 1,
          raw: type,
        }));
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add leave type
      .addCase(addLeaveType.fulfilled, (state, action) => {
        const type = action.payload;
        state.leaveTypes.push({
          id: type.id,
          name: type.name,
          status: type.status === 1,
          raw: type,
        });
      })
      
      // Update leave type
      .addCase(updateLeaveType.fulfilled, (state, action) => {
        const updatedType = action.payload;
        const index = state.leaveTypes.findIndex(
          (t) => t.id === updatedType.id
        );
        if (index !== -1) {
          state.leaveTypes[index] = {
            id: updatedType.id,
            name: updatedType.name,
            status: updatedType.status === 1,
            raw: updatedType,
          };
        }
      })
      
      // Delete leave type
      .addCase(deleteLeaveType.fulfilled, (state, action) => {
        state.leaveTypes = state.leaveTypes.filter(
          (t) => t.id !== action.payload
        );
      })
      
      // Update leave type status
      .addCase(updateLeaveTypeStatus.fulfilled, (state, action) => {
        const updatedType = action.payload;
        const index = state.leaveTypes.findIndex(
          (t) => t.id === updatedType.id
        );
        if (index !== -1) {
          state.leaveTypes[index].status = updatedType.status === 1;
          state.leaveTypes[index].raw = updatedType;
        }
      })
      
      .addCase(toggleLeaveTypeStatus.fulfilled, (state, action) => {
        const updatedType = action.payload;
        const index = state.leaveTypes.findIndex(
          (t) => t.id === updatedType.id
        );
        if (index !== -1) {
          state.leaveTypes[index].status = updatedType.status === 1;
        }
      });
  },
});

export const { clearError, clearCurrentLeave } = leaveSlice.actions;
export default leaveSlice.reducer;