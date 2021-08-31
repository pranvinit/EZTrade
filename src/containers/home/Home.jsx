import React, { useState, useEffect } from 'react';
import styles from './home.module.css';
import axios from 'axios';
//material ui specific
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

//importing container components
import SearchBar from '../../components/searchBar/SearchBar';
import Categories from '../categories/Categories';

//importing presentational components;
import FeaturedItem from '../../components/featuredItem/FeaturedItem';
import Items from '../../components/items/Items';


export default function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [lazyCount, setLazyCount] = useState(0);
    const [maxItems, setMaxItems] = useState(false);

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
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
            <SearchBar />
            <FeaturedItem />
            <Categories />
            {items.length ? <Items items={items} /> : <div className={styles.spinnerContainer}><CircularProgress /></div>}
            <div className={styles.spinnerContainer}>
                {loading && <CircularProgress />}
            </div>
            {maxItems && <Alert id={styles.alert} severity="info">No more items</Alert>}
        </div>
    )


}