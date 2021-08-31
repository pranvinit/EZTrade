import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserProfile = createAsyncThunk(
    'userAccount/fetchData',
    async (token) => {
        const response = await axios.get('/authoriseUser', {
            headers: {
                "x-access-token": token
            }
        })
        sessionStorage.setItem('userTempAuth', response.data.authorisation)
        return response.data
    }
)
const tempAuth = sessionStorage.getItem('userTempAuth')
const userAuthetication = createSlice({
    name: 'userAccount',
    initialState: {
        login: tempAuth || false,
        data: {
            name: '',
            userAddress: '',
            cartItems: []
        },
        hasFetched: false
    },
    reducers: {
        'logout': (state, action) => {
            return state = {}
        }
    },
    extraReducers: {
        [fetchUserProfile.pending]: (state, action) => {
            state.hasFetched = false;
        },
        [fetchUserProfile.fulfilled]: (state, { payload }) => {
            state.login = payload.authorisation;
            state.data = payload.data;
            state.hasFetched = true;
        },
        [fetchUserProfile.rejected]: (state, action) => {
            state.hasFetched = false;
        }
    }
})

export const { logout } = userAuthetication.actions;
export default userAuthetication.reducer;