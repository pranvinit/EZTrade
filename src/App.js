import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './App.module.css';
//importing async thunks
import { fetchSellerProfile } from './containers/sellerAccount/sellerAccountSlice';
import { fetchUserProfile } from './containers/userAccount/userAccountSlice';
//importing container components
import Home from './containers/home/Home';
import SellerAccount from './containers/sellerAccount/SellerAccount';
import UserAccount from './containers/userAccount/UserAccount';
import Sell from './containers/sell/Sell';
import SingleItem from './containers/singleItem/SingleItem';

//importing presentational components
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Cart from './components/cart/Cart';
import Orders from './components/orderPage/Oders';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

function App() {
  const dispatch = useDispatch()
  const sellerProfile = useSelector((state) => state.sellerAccount);
  const userProfile = useSelector((state) => state.userAccount)

  console.log(userProfile)
  console.log(sellerProfile)

  const PrivateRoute = ({ children, ...rest }) => {
    return (
      <Route {...rest} render={() => {
        return (
          sellerProfile.authentication ? children : <Redirect to={
            {
              pathname: '/sellerAccount'
            }
          } />
        )
      }} />
    )
  }

  useEffect(() => {
    dispatch(fetchUserProfile(localStorage.getItem('userJwtToken')));
    dispatch(fetchSellerProfile(localStorage.getItem('sellerJwtToken')));
  }, []);

  return (
    <div id={styles.mainContainer}>
      <Router>
        <Navbar />
        <div id={styles.contentWrap}>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route exact path='/singleItem/:id'>
              <SingleItem />
            </Route>
            <Route exact path='/userAccount'>
              <UserAccount />
            </Route>
            <Route exact path='/sellerAccount'>
              <SellerAccount />
            </Route>
            <PrivateRoute exact path='/sell'>
              <Sell />
            </PrivateRoute>
            <Route exact path='/cart'>
              <Cart />
            </Route>
            <Route exact path='/orders'>
              <Orders />
            </Route>
          </Switch>
        </div>
        <Footer />
      </Router>

    </div>

  );
}

export default App;
