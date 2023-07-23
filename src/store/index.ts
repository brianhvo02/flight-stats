import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import flightDataApi from './flightData';

const store = configureStore({
    reducer: {
        [flightDataApi.reducerPath]: flightDataApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(flightDataApi.middleware)
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
