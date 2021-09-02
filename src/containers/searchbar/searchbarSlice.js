import { createSlice } from "@reduxjs/toolkit";

const searchbarReducer = createSlice({
    name: 'searchQuery',
    initialState: '',
    reducers: {
        'changeQuery': (state, action) => state = action.payload
    }
})

export const { changeQuery } = searchbarReducer.actions;
export default searchbarReducer.reducer;