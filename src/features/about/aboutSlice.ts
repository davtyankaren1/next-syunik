import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AboutUs } from '@/integrations/supabase/api/about';
import { apiGetAboutUs } from '@/services/api';

export interface AboutState {
  data: AboutUs | null;
  loading: boolean;
  error: string | null;
}

const initialState: AboutState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchAbout = createAsyncThunk<AboutUs | null>(
  'about/fetch',
  async () => {
    return await apiGetAboutUs();
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbout.fulfilled, (state, action: PayloadAction<AboutUs | null>) => {
        state.loading = false;
        state.data = action.payload || null;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load about';
      });
  },
});

export default aboutSlice.reducer;
