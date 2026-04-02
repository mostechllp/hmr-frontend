import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial demo data
const initialOrganizations = [
  { id: 1, name: "THESAY", phone: "8767655654", email: "info@thesay.ae", multiCompany: "Yes", createdAt: "28 Mar, 2026" },
  { id: 2, name: "SAYGEN", phone: "+971 4 567 8901", email: "contact@saygen.ae", multiCompany: "Yes", createdAt: "15 Jan, 2025" },
  { id: 3, name: "WAREHOUSE", phone: "+971 2 345 6789", email: "admin@warehouse.ae", multiCompany: "No", createdAt: "03 Sep, 2024" },
  { id: 4, name: "FARMASSAY", phone: "+971 56 789 1234", email: "info@farmassay.ae", multiCompany: "Yes", createdAt: "22 Nov, 2024" },
];

export const fetchOrganizations = createAsyncThunk(
  'organizations/fetchAll',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return initialOrganizations;
  }
);

export const addOrganization = createAsyncThunk(
  'organizations/add',
  async (organizationData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newOrg = {
      id: Date.now(),
      ...organizationData,
    };
    return newOrg;
  }
);

export const updateOrganization = createAsyncThunk(
  'organizations/update',
  async ({ id, data }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, ...data };
  }
);

export const deleteOrganization = createAsyncThunk(
  'organizations/delete',
  async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return id;
  }
);

const organizationSlice = createSlice({
  name: 'organizations',
  initialState: {
    organizations: [],
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addOrganization.fulfilled, (state, action) => {
        state.organizations.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        const index = state.organizations.findIndex(org => org.id === action.payload.id);
        if (index !== -1) {
          state.organizations[index] = { ...state.organizations[index], ...action.payload };
        }
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.organizations = state.organizations.filter(org => org.id !== action.payload);
        state.totalCount -= 1;
      });
  },
});

export default organizationSlice.reducer;