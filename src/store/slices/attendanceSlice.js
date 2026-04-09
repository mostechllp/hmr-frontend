import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';

// Helper for error handling
const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || `Server error: ${error.response.status}`;
  }
  if (error.request) {
    return 'Network error: Unable to connect to server';
  }
  return error.message || 'An unexpected error occurred';
};

// Async Thunks
export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/attendance`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const uploadAttendanceFile = createAsyncThunk(
  'attendance/upload',
  async ({ company, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('company', company);
      formData.append('file', file);
      
      const response = await apiClient.post(`/admin/attendance/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchUploadStatus = createAsyncThunk(
  'attendance/fetchUploadStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/attendance/upload-status/${id}`);
      return { id, status: response.data };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchPunchInToday = createAsyncThunk(
  'attendance/fetchPunchInToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/attendance/punch-in-today`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchPunchInYesterday = createAsyncThunk(
  'attendance/fetchPunchInYesterday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/attendance/punch-in-yesterday`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchPunchOutToday = createAsyncThunk(
  'attendance/fetchPunchOutToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/attendance/punch-out-today`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchLateComers = createAsyncThunk(
  'attendance/fetchLateComers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/attendance/late-comers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchAbsentees = createAsyncThunk(
  'attendance/fetchAbsentees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/admin/attendance/absentees`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    records: [],
    uploadStatus: null, // 'idle', 'processing', 'completed', 'failed'
    uploadStatusId: null,
    punchInToday: [],
    punchInYesterday: [],
    punchOutToday: [],
    lateComers: [],
    absentees: [],
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    clearUploadStatus: (state) => {
      state.uploadStatus = null;
      state.uploadStatusId = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Attendance Records
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data || action.payload;
        state.totalCount = action.payload.total || (action.payload.data?.length || 0);
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload Attendance File
      .addCase(uploadAttendanceFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAttendanceFile.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadStatus = 'processing';
        state.uploadStatusId = action.payload.id;
      })
      .addCase(uploadAttendanceFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadStatus = 'failed';
      })
      
      // Fetch Upload Status
      .addCase(fetchUploadStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUploadStatus.fulfilled, (state, action) => {
        state.uploadStatus = action.payload.status;
      })
      .addCase(fetchUploadStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Fetch Punch In Today
      .addCase(fetchPunchInToday.fulfilled, (state, action) => {
        state.punchInToday = action.payload.data || action.payload;
      })
      .addCase(fetchPunchInToday.rejected, (state, action) => {
        console.error('Failed to fetch punch in today:', action.payload);
      })
      
      // Fetch Punch In Yesterday
      .addCase(fetchPunchInYesterday.fulfilled, (state, action) => {
        state.punchInYesterday = action.payload.data || action.payload;
      })
      .addCase(fetchPunchInYesterday.rejected, (state, action) => {
        console.error('Failed to fetch punch in yesterday:', action.payload);
      })
      
      // Fetch Punch Out Today
      .addCase(fetchPunchOutToday.fulfilled, (state, action) => {
        state.punchOutToday = action.payload.data || action.payload;
      })
      .addCase(fetchPunchOutToday.rejected, (state, action) => {
        console.error('Failed to fetch punch out today:', action.payload);
      })
      
      // Fetch Late Comers
      .addCase(fetchLateComers.fulfilled, (state, action) => {
        state.lateComers = action.payload.data || action.payload;
      })
      .addCase(fetchLateComers.rejected, (state, action) => {
        console.error('Failed to fetch late comers:', action.payload);
      })
      
      // Fetch Absentees
      .addCase(fetchAbsentees.fulfilled, (state, action) => {
        state.absentees = action.payload.data || action.payload;
      })
      .addCase(fetchAbsentees.rejected, (state, action) => {
        console.error('Failed to fetch absentees:', action.payload);
      });
  },
});

export const { clearUploadStatus, clearErrors } = attendanceSlice.actions;
export default attendanceSlice.reducer;