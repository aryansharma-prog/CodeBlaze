import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/user/register', userData);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data.user;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || error.message || 'Registration failed';
      return rejectWithValue(msg);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/user/login', credentials);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data.user;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || error.message || 'Login failed';
      return rejectWithValue(msg);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check');
      return data.user;
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem('token');
      const msg = error.response?.data?.message || error.response?.data || error.message || 'Authentication required';
      return rejectWithValue(msg);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      localStorage.removeItem('token');
      return null;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true, // start loading while checking session
    error: null
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    updateUserSolved: (state, action) => {
      if (state.user) {
        const problemId = action.payload;
        if (!state.user.problemSolved) state.user.problemSolved = [];
        if (!state.user.problemSolved.includes(problemId)) {
          state.user.problemSolved.push(problemId);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Registration failed';
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Invalid credentials';
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  }
});

export const { clearAuthError, updateUserSolved } = authSlice.actions;
export default authSlice.reducer;
