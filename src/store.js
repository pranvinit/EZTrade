import { configureStore } from "@reduxjs/toolkit";
import searchBarReducer from './components/searchBar/searchBarSlice';
import sellerAuthentication from './containers/sellerAccount/sellerAccountSlice';

const store = configureStore({
    reducer: {
        searchBar: searchBarReducer,
        sellerAccount: sellerAuthentication
    }
})

export default store;

