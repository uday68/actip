import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import uiReducer from './slices/uiSlice';
import investigationReducer from './slices/investigationSlice';
import graphReducer from './slices/graphSlice';
import { ctiApi } from './services/ctiApi';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    investigation: investigationReducer,
    graph: graphReducer,
    [ctiApi.reducerPath]: ctiApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(ctiApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
