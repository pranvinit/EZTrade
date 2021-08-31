import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchSellerProfile = createAsyncThunk(
    'sellerAccount/fetchData',
    async (token) => {
        const response = await axios.get('/authoriseSeller', {
            headers: {
                "x-access-token": token
            }
        })
        sessionStorage.setItem('sellerTempAuth', response.data.authorisation)
        return response.data
    }

)

const tempAuth = sessionStorage.getItem('sellerTempAuth')
const sellerAuthentication = createSlice({
    name: 'sellerAccount',
    initialState: {
        authentication: tempAuth || false,
        data: {},
        hasFetched: false
    },
    reducers: {
        'sellerLogout': (state, action) => {
            return state = {}
        }
    }
    ,
    extraReducers: {
        [fetchSellerProfile.pending]: (state, action) => {
            state.hasFetched = false;
        },
        [fetchSellerProfile.fulfilled]: (state, { payload }) => {
            state.authentication = payload.authorisation;
            state.data = payload.data;
            state.hasFetched = true;
        },
        [fetchSellerProfile.rejected]: (state, action) => {
            state.hasFetched = false;
        }
    }
})
export const { sellerLogout } = sellerAuthentication.actions;
export default sellerAuthentication.reducer;