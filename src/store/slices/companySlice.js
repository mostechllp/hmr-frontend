import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

// Fetch companies for a specific organization
export const fetchCompanies = createAsyncThunk(
  "companies/fetchAll",
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/companies");
      let companies = response.data.data || [];
      // Filter companies by parent organization
      if (organizationId) {
        companies = companies.filter(
          (company) => company.parent_organization_id === organizationId
        );
      }
      return { companies, organizationId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch companies",
      );
    }
  },
);

// Add company
export const addCompany = createAsyncThunk(
  "companies/add",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/admin/companies", companyData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add company",
      );
    }
  },
);

// Update company
export const updateCompany = createAsyncThunk(
  "companies/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/admin/companies/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update company",
      );
    }
  },
);

// Delete company
export const deleteCompany = createAsyncThunk(
  "companies/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/companies/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  },
);

const companySlice = createSlice({
  name: "companies",
  initialState: {
    companies: [],
    currentOrganizationId: null,
    currentOrganizationName: null,
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    clearCompanies: (state) => {
      state.companies = [];
      state.currentOrganizationId = null;
      state.currentOrganizationName = null;
    },
    setCurrentOrganization: (state, action) => {
      state.currentOrganizationId = action.payload.id;
      state.currentOrganizationName = action.payload.name;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrganizationId = action.payload.organizationId;
        state.companies = action.payload.companies.map((company) => ({
          id: company.id,
          name: company.name,
          phone: company.phone || "-",
          email: company.email || "-",
          address: company.address || "-",
          logo: company.logo || null,
          parent_organization_id: company.parent_organization_id,
          createdAt: company.created_at
            ? new Date(company.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            : "-",
          raw: company,
        }));
        state.totalCount = action.payload.companies.length;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Add Company
      .addCase(addCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.loading = false;
        const newCompany = {
          id: action.payload.id,
          name: action.payload.name,
          phone: action.payload.phone || "-",
          email: action.payload.email || "-",
          address: action.payload.address || "-",
          logo: action.payload.logo || null,
          parent_organization_id: action.payload.parent_organization_id,
          createdAt: action.payload.created_at
            ? new Date(action.payload.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            : new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }),
          raw: action.payload,
        };
        state.companies.unshift(newCompany);
        state.totalCount += 1;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Update Company
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(
          (company) => company.id === action.payload.id,
        );
        if (index !== -1) {
          state.companies[index] = {
            ...state.companies[index],
            name: action.payload.name,
            phone: action.payload.phone || "-",
            email: action.payload.email || "-",
            address: action.payload.address || "-",
            raw: action.payload,
          };
        }
      })
      // Delete Company
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(
          (company) => company.id !== action.payload,
        );
        state.totalCount -= 1;
      });
  },
});

export const { clearCompanies, setCurrentOrganization } = companySlice.actions;
export default companySlice.reducer;