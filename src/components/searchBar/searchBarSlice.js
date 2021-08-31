import { createSlice } from "@reduxjs/toolkit";

const searchBarReducer = createSlice({
    name: 'searchQuery',
    initialState: '',
    reducers: {
        'changeQuery': (state, action) => state = action.payload
    }
})

export const { changeQuery } = searchBarReducer.actions;
export default searchBarReducer.reducer;