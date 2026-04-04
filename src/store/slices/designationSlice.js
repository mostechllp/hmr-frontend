import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial demo data
const initialDesignations = [
  { id: 1, name: "Drivers", defaultPunchAccess: true },
  { id: 2, name: "Employee", defaultPunchAccess: false },
  { id: 3, name: "HR", defaultPunchAccess: false },
  { id: 4, name: "Manager", defaultPunchAccess: false },
  { id: 5, name: "Salesperson", defaultPunchAccess: true },
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchDesignations = createAsyncThunk(
  "designations/fetchAll",
  async () => {
    await delay(500);
    return initialDesignations;
  }
);

export const addDesignation = createAsyncThunk(
  "designations/add",
  async (designationData) => {
    await delay(500);
    const newDesignation = {
      id: Date.now(),
      ...designationData,
    };
    return newDesignation;
  }
);

export const updateDesignation = createAsyncThunk(
  "designations/update",
  async ({ id, data }) => {
    await delay(500);
    return { id, ...data };
  }
);

export const deleteDesignation = createAsyncThunk(
  "designations/delete",
  async (id) => {
    await delay(500);
    return id;
  }
);

const designationSlice = createSlice({
  name: "designations",
  initialState: {
    designations: [],
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Designations
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Designation
      .addCase(addDesignation.fulfilled, (state, action) => {
        state.designations.push(action.payload);
        state.totalCount += 1;
      })
      // Update Designation
      .addCase(updateDesignation.fulfilled, (state, action) => {
        const index = state.designations.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.designations[index] = { ...state.designations[index], ...action.payload };
        }
      })
      // Delete Designation
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.designations = state.designations.filter(d => d.id !== action.payload);
        state.totalCount -= 1;
      });
  },
});

export default designationSlice.reducer;