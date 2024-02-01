import { createSlice } from '@reduxjs/toolkit';

const initialState: { value: boolean } = { value: false };

const globalSlice = createSlice({
	name: 'gLoading',
	initialState,
	reducers: {},
});

export default globalSlice.reducer;
