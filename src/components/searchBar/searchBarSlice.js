import { createSlice } from "@reduxjs/toolkit";

const searchBarReducer = createSlice({
    name: 'searchBar',
    initialState: '',
    reducers: {
        'addChange': (state, action) => state = action.payload
    }
})

export const { addChange } = searchBarReducer.actions;
export default searchBarReducer.reducer;