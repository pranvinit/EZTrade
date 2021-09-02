import { configureStore } from "@reduxjs/toolkit";
import searchbarReducer from './containers/searchbar/searchbarSlice'
import sellerAuthentication from './containers/sellerAccount/sellerAccountSlice';
import userAuthentication from './containers/userAccount/userAccountSlice';

const store = configureStore({
    reducer: {
        searchQuery: searchbarReducer,
        sellerAccount: sellerAuthentication,
        userAccount: userAuthentication
    }
})

export default store;

