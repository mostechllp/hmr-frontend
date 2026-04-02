import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/employees');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employees/add',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/employees/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee');
    }
  }
);

const initialState = {
  employees: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  perPage: 10,
  filters: {
    status: 'all',
    search: '',
    company: 'all',
    department: 'all',
  },
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
      state.currentPage = 1;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data || action.payload;
        state.totalCount = action.payload.total || action.payload.length;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
        state.totalCount -= 1;
      });
  },
});

export const { setCurrentPage, setPerPage, setFilters, resetFilters } = employeeSlice.actions;
export default employeeSlice.reducer;