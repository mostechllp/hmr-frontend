import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial demo data
const initialAgreements = [
  { id: 1, name: "Employment Contract - Standard", folder: "HR", shareWith: "All Employees", expiry: "2026-12-31" },
  { id: 2, name: "Employee Termination Agreement", folder: "Agreements", shareWith: "Procurement", expiry: "2027-06-15" },
  { id: 3, name: "Vendor Service Agreement", folder: "Agreements", shareWith: "Procurement", expiry: "2025-09-20" },
  { id: 4, name: "IT Security Policy", folder: "IT", shareWith: "IT Department", expiry: "2025-08-10" },
  { id: 5, name: "Employee Handbook 2025", folder: "HR", shareWith: "All Employees", expiry: "2026-01-01" },
  { id: 6, name: "Client Master Service Agreement", folder: "Agreements", shareWith: "Sales Team", expiry: "2026-11-30" },
  { id: 7, name: "Software License Agreement", folder: "IT", shareWith: "IT Dept", expiry: "2025-12-15" },
  { id: 8, name: "Financial Audit Contract", folder: "Finance", shareWith: "Finance Team", expiry: "2025-07-01" },
  { id: 9, name: "Data Protection Addendum", folder: "Legal", shareWith: "Compliance", expiry: "2027-03-22" },
  { id: 10, name: "Consultancy Agreement", folder: "Agreements", shareWith: "External Partners", expiry: "2025-10-05" },
];

export const fetchAgreements = createAsyncThunk(
  'agreements/fetchAll',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return initialAgreements;
  }
);

export const addAgreement = createAsyncThunk(
  'agreements/add',
  async (agreementData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAgreement = {
      id: Date.now(),
      ...agreementData,
    };
    return newAgreement;
  }
);

export const updateAgreement = createAsyncThunk(
  'agreements/update',
  async ({ id, data }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, ...data };
  }
);

export const deleteAgreement = createAsyncThunk(
  'agreements/delete',
  async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return id;
  }
);

const agreementSlice = createSlice({
  name: 'agreements',
  initialState: {
    agreements: [],
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgreements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAgreements.fulfilled, (state, action) => {
        state.loading = false;
        state.agreements = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchAgreements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addAgreement.fulfilled, (state, action) => {
        state.agreements.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(updateAgreement.fulfilled, (state, action) => {
        const index = state.agreements.findIndex(ag => ag.id === action.payload.id);
        if (index !== -1) {
          state.agreements[index] = { ...state.agreements[index], ...action.payload };
        }
      })
      .addCase(deleteAgreement.fulfilled, (state, action) => {
        state.agreements = state.agreements.filter(ag => ag.id !== action.payload);
        state.totalCount -= 1;
      });
  },
});

export default agreementSlice.reducer;