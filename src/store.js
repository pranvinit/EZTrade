import { configureStore } from "@reduxjs/toolkit";
import searchBarReducer from './components/searchBar/searchBarSlice';
import sellerAuthentication from './containers/sellerAccount/sellerAccountSlice';
import userAuthentication from './containers/userAccount/userAccountSlice';

const store = configureStore({
    reducer: {
        searchQuery: searchBarReducer,
        sellerAccount: sellerAuthentication,
        userAccount: userAuthentication
    }
})

export default store;

