import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

// Fetch all WFH requests (Admin)
export const fetchAdminWFHRequests = createAsyncThunk(
  "adminWfh/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/wfh-requests", { params });
      
      // Handle Laravel-style pagination (data.data.data) or simple array (data.data)
      const rawData = response.data.data.data || response.data.data || [];
      
      // Transform data for frontend consistency
      const transformedData = rawData.map(item => ({
        id: item.id,
        employee_id: item.employee_id,
        employeeName: item.employee 
          ? `${item.employee.first_name || ""} ${item.employee.last_name || ""}`.trim() 
          : (item.employee_name || "N/A"),
        date: item.date,
        reason: item.reason || "",
        notes: item.notes || "",
        status: item.status || "pending",
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        // Keep raw employee object if needed for modal details
        employee: item.employee
      }));

      return {
        data: transformedData,
        total: response.data.data.total || transformedData.length,
        currentPage: response.data.data.current_page || 1,
        perPage: response.data.data.per_page || transformedData.length
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch WFH requests"
      );
    }
  }
);

// Fetch single WFH request
export const fetchWFHRequestById = createAsyncThunk(
  "adminWfh/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/wfh-requests/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch WFH request"
      );
    }
  }
);

// Update WFH request status
export const updateWFHRequestStatus = createAsyncThunk(
  "adminWfh/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      // POST request according to the API image provided
      const response = await apiClient.post(`/admin/wfh-requests/${id}/status`, { status });
      
      if (response.data?.status === "success") {
        return { id, status };
      }
      return rejectWithValue(response.data?.message || "Failed to update status");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

const initialState = {
  requests: [],
  currentRequest: null,
  filter: {
    status: 'all',
    search: '',
  },
  pagination: {
    currentPage: 1,
    perPage: 10,
    total: 0
  },
  loading: false,
  error: null,
};

const adminWFHSlice = createSlice({
  name: 'adminWfh',
  initialState,
  reducers: {
    setAdminWfhFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setAdminWfhPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearAdminWfhError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all requests
      .addCase(fetchAdminWFHRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminWFHRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.data;
        state.pagination.total = action.payload.total;
        state.pagination.currentPage = action.payload.currentPage;
        state.pagination.perPage = action.payload.perPage;
      })
      .addCase(fetchAdminWFHRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch by ID
      .addCase(fetchWFHRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWFHRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
      })
      .addCase(fetchWFHRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update status
      .addCase(updateWFHRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWFHRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        const index = state.requests.findIndex(r => r.id === id);
        if (index !== -1) {
          state.requests[index].status = status;
        }
        if (state.currentRequest && state.currentRequest.id === id) {
          state.currentRequest.status = status;
        }
      })
      .addCase(updateWFHRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAdminWfhFilter, setAdminWfhPagination, clearAdminWfhError } = adminWFHSlice.actions;
export default adminWFHSlice.reducer;
