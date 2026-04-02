import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialLeaveTypes = [
  { id: 1, name: "Sick Leave", status: "Active" },
  { id: 2, name: "Personal Leave", status: "Active" },
  { id: 3, name: "Annual Leave", status: "Active" },
];

const initialLeaves = [
  { id: 1, employee: "JITHIN", type: "Annual Leave", fromDate: "01/04/2026", toDate: "20/04/2026", days: 20, claimSalary: "Yes", doc: "-", reason: "Request for annual leave", status: "Approved", processedBy: "HR Manager" },
  { id: 2, employee: "FAWZY", type: "Sick Leave", fromDate: "05 Apr, 2026", toDate: "06 Apr, 2026", days: 2, claimSalary: "Yes", doc: "medical_cert.pdf", reason: "Fever and body pain", status: "Pending", processedBy: "N/A" },
  { id: 3, employee: "FAHEEM", type: "Annual Leave", fromDate: "10 Apr, 2026", toDate: "20 Apr, 2026", days: 10, claimSalary: "Yes", doc: "-", reason: "Annual vacation with family", status: "Approved", processedBy: "HR Admin" },
  { id: 4, employee: "ABHILASH", type: "Emergency Leave", fromDate: "01 Apr, 2026", toDate: "02 Apr, 2026", days: 2, claimSalary: "No", doc: "-", reason: "Family emergency", status: "Approved", processedBy: "HR Manager" },
  { id: 5, employee: "AKSHAY", type: "Flood", fromDate: "02 Apr, 2026", toDate: "03 Apr, 2026", days: 2, claimSalary: "No", doc: "-", reason: "Severe flood on the way", status: "Approved", processedBy: "HR Admin" },
  { id: 6, employee: "VIJAY", type: "Sick Leave", fromDate: "12 Apr, 2026", toDate: "13 Apr, 2026", days: 2, claimSalary: "Yes", doc: "prescription.pdf", reason: "Viral infection", status: "Pending", processedBy: "N/A" },
  { id: 7, employee: "SUNEEL", type: "Annual Leave", fromDate: "15 Apr, 2026", toDate: "25 Apr, 2026", days: 10, claimSalary: "Yes", doc: "-", reason: "Vacation to Kerala", status: "Pending", processedBy: "N/A" },
  { id: 8, employee: "SUBHANI", type: "Sick Leave", fromDate: "07 Apr, 2026", toDate: "07 Apr, 2026", days: 1, claimSalary: "No", doc: "-", reason: "Cough", status: "Rejected", processedBy: "HR Admin" },
  { id: 9, employee: "SENTIL", type: "Annual Leave", fromDate: "09 Apr, 2026", toDate: "19 Apr, 2026", days: 10, claimSalary: "Yes", doc: "-", reason: "Annual Leave Vacation", status: "Pending", processedBy: "HR Manager" },
  { id: 10, employee: "SHANOOB", type: "Flood", fromDate: "14 Apr, 2026", toDate: "14 Apr, 2026", days: 1, claimSalary: "No", doc: "-", reason: "Can't step out of the flat", status: "Pending", processedBy: "N/A" },
];

export const fetchLeaves = createAsyncThunk(
  'leaves/fetchAll',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return initialLeaves;
  }
);

export const fetchLeaveTypes = createAsyncThunk(
  'leaves/fetchTypes',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return initialLeaveTypes;
  }
);

export const addLeaveType = createAsyncThunk(
  'leaves/addType',
  async (typeData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: Date.now(), ...typeData };
  }
);

export const updateLeaveType = createAsyncThunk(
  'leaves/updateType',
  async ({ id, name }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, name };
  }
);

export const deleteLeaveType = createAsyncThunk(
  'leaves/deleteType',
  async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return id;
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'leaves/updateStatus',
  async ({ id, status, processedBy }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, status, processedBy };
  }
);

const leaveSlice = createSlice({
  name: 'leaves',
  initialState: {
    leaves: [],
    leaveTypes: [],
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch leaves
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch leave types
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
        state.leaveTypes = action.payload;
      })
      // Add leave type
      .addCase(addLeaveType.fulfilled, (state, action) => {
        state.leaveTypes.push(action.payload);
      })
      // Update leave type
      .addCase(updateLeaveType.fulfilled, (state, action) => {
        const index = state.leaveTypes.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.leaveTypes[index].name = action.payload.name;
        }
      })
      // Delete leave type
      .addCase(deleteLeaveType.fulfilled, (state, action) => {
        state.leaveTypes = state.leaveTypes.filter(t => t.id !== action.payload);
      })
      // Update leave status
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const index = state.leaves.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.leaves[index].status = action.payload.status;
          state.leaves[index].processedBy = action.payload.processedBy;
        }
      });
  },
});

export default leaveSlice.reducer;