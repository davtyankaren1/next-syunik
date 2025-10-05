import { configureStore } from '@reduxjs/toolkit';
import aboutReducer from '@/features/about/aboutSlice';
import contactReducer from '@/features/contact/contactSlice';
import roomsReducer from '@/features/rooms/roomsSlice';
import roomDetailReducer from '@/features/roomDetail/roomDetailSlice';

export const store = configureStore({
  reducer: {
    about: aboutReducer,
    contact: contactReducer,
    rooms: roomsReducer,
    roomDetail: roomDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
