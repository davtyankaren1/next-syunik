import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Room } from '@/integrations/supabase/api/rooms';
import { apiGetRooms } from '@/services/api';

export interface RoomsState {
  items: Room[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchRooms = createAsyncThunk<Room[]>(
  'rooms/fetch',
  async () => {
    return await apiGetRooms();
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load rooms';
      });
  },
});

export default roomsSlice.reducer;
