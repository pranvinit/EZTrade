import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './App.module.css';
//importing authentication action creators
//importing async thunks
import { fetchSellerProfile } from './containers/sellerAccount/sellerAccountSlice';
//importing container components
import Home from './containers/home/Home';
import SellerAccount from './containers/sellerAccount/SellerAccount';
import Sell from './containers/sell/Sell';
import SingleItem from './containers/singleItem/SingleItem';

//importing presentational components
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

function App() {
  const dispatch = useDispatch()
  const sellerAuthenticaton = useSelector((state) => state.sellerAccount.authentication);

  const PrivateRoute = ({ children, ...rest }) => {
    return (
      <Route {...rest} render={() => {
        return (
          sellerAuthenticaton ? children : <Redirect to={
            {
              pathname: '/sellerAccount'
            }
          } />
        )
      }} />
    )
  }

  useEffect(() => {
    dispatch(fetchSellerProfile(localStorage.getItem('jwtToken')));
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
            <Route exact path='/sellerAccount'>
              <SellerAccount />
            </Route>
            <PrivateRoute exact path='/sell'>
              <Sell />
            </PrivateRoute>
          </Switch>
        </div>
        <Footer />
      </Router>

    </div>

  );
}

export default App;
