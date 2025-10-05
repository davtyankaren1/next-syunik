import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Room } from '@/integrations/supabase/api/rooms';
import { apiGetRoomById } from '@/services/api';

export interface RoomDetailState {
  data: Room | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoomDetailState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchRoomById = createAsyncThunk<Room | null, string>(
  'roomDetail/fetchById',
  async (id: string) => {
    return await apiGetRoomById(id);
  }
);

const roomDetailSlice = createSlice({
  name: 'roomDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action: PayloadAction<Room | null>) => {
        state.loading = false;
        state.data = action.payload || null;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load room';
      });
  },
});

export default roomDetailSlice.reducer;
