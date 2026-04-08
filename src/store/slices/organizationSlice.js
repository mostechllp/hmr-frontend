import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";

// Fetch organizations
export const fetchOrganizations = createAsyncThunk(
  "organizations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/organizations");
      console.log("res: ", response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch organizations",
      );
    }
  },
);

// Add organization
export const addOrganization = createAsyncThunk(
  "organizations/add",
  async (organizationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/admin/organizations", organizationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add organization",
      );
    }
  },
);

// Update organization
export const updateOrganization = createAsyncThunk(
  "organizations/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/admin/organizations/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update organization",
      );
    }
  },
);

// Delete organization
export const deleteOrganization = createAsyncThunk(
  "organizations/delete",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/organizations/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  },
);

// Fetch companies
export const fetchCompanies = createAsyncThunk(
  "organizations/fetchCompanies",
  async (organizationId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/admin/companies");
      // Filter companies by parent organization if organizationId is provided
      let companies = response.data.data || [];
      if (organizationId) {
        companies = companies.filter(
          (company) => company.parent_organization_id === organizationId
        );
      }
      return companies;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch companies",
      );
    }
  },
);

// Add company
export const addCompany = createAsyncThunk(
  "organizations/addCompany",
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
  "organizations/updateCompany",
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
  "organizations/deleteCompany",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/companies/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  },
);

const organizationSlice = createSlice({
  name: "organizations",
  initialState: {
    organizations: [],
    companies: [],
    currentOrganization: null,
    loading: false,
    error: null,
    totalCount: 0,
    companiesLoading: false,
  },
  reducers: {
    setCurrentOrganization: (state, action) => {
      state.currentOrganization = action.payload;
    },
    clearCompanies: (state) => {
      state.companies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Organizations
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        const apiData = action.payload || [];
        state.organizations = apiData.map((org) => ({
          id: org.id,
          name: org.name,
          phone: org.phone || "-",
          email: org.email || "-",
          parentOrganization: org.parent_organization?.name || "—",
          logo: org.logo || null,
          createdAt: org.created_at
            ? new Date(org.created_at).toLocaleDateString()
            : "-",
          raw: org,
        }));
        state.totalCount = apiData.length || 0;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Add Organization
      .addCase(addOrganization.fulfilled, (state, action) => {
        const newOrg = {
          id: action.payload.id,
          name: action.payload.name,
          phone: action.payload.phone || "-",
          email: action.payload.email || "-",
          parentOrganization: action.payload.parent_organization?.name || "—",
          logo: action.payload.logo || null,
          createdAt: action.payload.created_at
            ? new Date(action.payload.created_at).toLocaleDateString()
            : new Date().toLocaleDateString(),
          raw: action.payload,
        };
        state.organizations.unshift(newOrg);
        state.totalCount += 1;
      })
      // Update Organization
      .addCase(updateOrganization.fulfilled, (state, action) => {
        const index = state.organizations.findIndex(
          (org) => org.id === action.payload.id,
        );
        if (index !== -1) {
          state.organizations[index] = {
            ...state.organizations[index],
            name: action.payload.name,
            phone: action.payload.phone || "-",
            email: action.payload.email || "-",
            raw: action.payload,
          };
        }
      })
      // Delete Organization
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.organizations = state.organizations.filter(
          (org) => org.id !== action.payload,
        );
        state.totalCount -= 1;
      })
      // Fetch Companies
      .addCase(fetchCompanies.pending, (state) => {
        state.companiesLoading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companiesLoading = false;
        state.companies = action.payload.map((company) => ({
          id: company.id,
          name: company.name,
          phone: company.phone || "-",
          email: company.email || "-",
          parentOrganization: company.parent_organization?.name || state.currentOrganization?.name || "-",
          logo: company.logo || null,
          createdAt: company.created_at
            ? new Date(company.created_at).toLocaleDateString()
            : "-",
          raw: company,
        }));
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.companiesLoading = false;
        state.error = action.payload || action.error.message;
      })
      // Add Company
      .addCase(addCompany.fulfilled, (state, action) => {
        const newCompany = {
          id: action.payload.id,
          name: action.payload.name,
          phone: action.payload.phone || "-",
          email: action.payload.email || "-",
          parentOrganization: state.currentOrganization?.name || "-",
          logo: action.payload.logo || null,
          createdAt: action.payload.created_at
            ? new Date(action.payload.created_at).toLocaleDateString()
            : new Date().toLocaleDateString(),
          raw: action.payload,
        };
        state.companies.unshift(newCompany);
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
            raw: action.payload,
          };
        }
      })
      // Delete Company
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(
          (company) => company.id !== action.payload,
        );
      });
  },
});

export const { setCurrentOrganization, clearCompanies } = organizationSlice.actions;
export default organizationSlice.reducer;