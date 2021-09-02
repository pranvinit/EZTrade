import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from './home.module.css';
import axios from 'axios';
//material ui specific
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

//importing container components
import Searchbar from '../searchbar/Searchbar';
import Categories from '../categories/Categories';

//importing presentational components;
import FeaturedItem from '../../components/featuredItem/FeaturedItem';
import Items from '../../components/items/Items';

//importing action creators
import { changeQuery } from '../searchbar/searchbarSlice';


export default function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [lazyCount, setLazyCount] = useState(0);
    const [maxItems, setMaxItems] = useState(false);
    const dispatch = useDispatch();

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 30) {
            console.log('now')
            setLazyCount((prev) => prev + 3)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    })

    useEffect(() => {
        dispatch(changeQuery(null))
    }, [])

    useEffect(() => {
        if (!maxItems) {
            setLoading(true);
            const getItems = async () => {
                const response = await axios({
                    method: 'POST',
                    url: '/fetchItems',
                    data: { count: lazyCount }
                });
                if (!response.data.length) {
                    setMaxItems(true);
                }
                setItems((prev) => [...prev, ...response.data])
                setLoading(false)
            }
            getItems()
        }
    }, [lazyCount])

    return (
        <div id={styles.homeContainer}>
            <Searchbar />
            <FeaturedItem />
            <Categories />
            <Items items={items} />
            <div className={styles.spinnerContainer}>
                {loading && <CircularProgress />}
            </div>
            {maxItems && <Alert id={styles.alert} severity="info">No more items</Alert>}
        </div>
    )


}