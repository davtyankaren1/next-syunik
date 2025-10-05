import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Contact } from '@/integrations/supabase/api/contact';
import { apiGetContact } from '@/services/api';

export interface ContactState {
  data: Contact | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchContact = createAsyncThunk<Contact | null>(
  'contact/fetch',
  async () => {
    return await apiGetContact();
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContact.fulfilled, (state, action: PayloadAction<Contact | null>) => {
        state.loading = false;
        state.data = action.payload || null;
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load contact';
      });
  },
});

export default contactSlice.reducer;
