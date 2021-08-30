import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchSellerProfile = createAsyncThunk(
    'sellerAccount/fetchData',
    async (token) => {
        const response = await axios.get('/authenticateSeller', {
            headers: {
                "x-access-token": token
            }
        })
        sessionStorage.setItem('tempAuth', response.data.authorisation)
        return response.data
    }

)

const tempAuth = sessionStorage.getItem('tempAuth')
const sellerAuthentication = createSlice({
    name: 'sellerAccount',
    initialState: {
        authentication: tempAuth || false,
        data: {},
        hasFetched: false
    },
    reducers: {}
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

export const { authentication } = sellerAuthentication.actions;
export default sellerAuthentication.reducer;