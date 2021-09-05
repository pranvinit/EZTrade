import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styles from './home.module.css';
import axios from 'axios';
//material ui specific
import { CircularProgress, MenuItem, InputLabel, Select } from '@material-ui/core';
import { ExpandLess } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';

//importing container components
import Searchbar from '../searchbar/Searchbar';
import Categories from '../categories/Categories';

//importing presentational components;
import FeaturedItem from '../../components/featuredItem/FeaturedItem';
import Items from '../../components/items/Items';
import AlertComponent from '../../utils/AlertComponent';

//importing action creators
import { changeQuery } from '../searchbar/searchbarSlice';


export default function Home() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [maxItems, setMaxItems] = useState(false);
    const [loadCount, setLoadCount] = useState(0)
    const [response, setResponse] = useState({});

    const [sort, setSort] = useState('');

    const dispatch = useDispatch();


    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !loading) {
            setLoadCount(prev => prev + 3);
        }
        if (window.scrollY >= 1200) {
            scrollToPageTop.current.style.width = '60px'
            scrollToPageTop.current.style.height = '60px'
        } else {
            scrollToPageTop.current.style.width = '0px'
            scrollToPageTop.current.style.height = '0px'
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    })

    const getItems = async () => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: '/fetchItems',
                data: { sort: sort, count: loadCount }
            });
            setItems((prev) => [...prev, ...response.data])
            setLoading(false)
            if (!response.data.length) {
                setMaxItems(true);
            }
        }
        catch {
            setResponse(prev => ({
                ...prev,
                operation: 'warning',
                message: 'Failed to fetch items'
            }))
            setLoading(false)
            setOpen(true)
        }
    }

    useEffect(() => {
        if (!maxItems) {
            getItems()
        }
    }, [loadCount, sort])

    useEffect(() => {
        setItems([]);
        setLoadCount(0)
        setMaxItems(false);
    }, [sort])


    const [featuredItems, setFeaturedItems] = useState([])

    useEffect(() => {
        dispatch(changeQuery(null))
        const fetchFeaturedItems = async () => {
            try {
                const response = await axios.get('/featuredItems');
                setFeaturedItems(response.data)

            } catch {
                setResponse(prev => ({
                    ...prev,
                    operation: 'warning',
                    message: 'Failed to fetch featured items'
                }))
                setOpen(true)
            }
        }
        fetchFeaturedItems()
    }, [])

    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    const scrollToPageTop = useRef();

    return (
        <div id={styles.homeContainer}>
            <div id={styles.homeTop}>
                <Searchbar />
                <AlertComponent message={response.message} operation={response.operation} open={open} changeOpen={changeOpen} />
                {featuredItems.length !== 0 ? <FeaturedItem items={featuredItems} /> : <span className={styles.itemsHeading}>No featured items</span>}
                <Categories />
            </div>
            <div aria-label="scrollToPageTop" ref={scrollToPageTop} id={styles.scrollToPageTop} onClick={() => window.scrollTo(0, 0)}>
                <ExpandLess style={{ fontSize: 30, color: '#fff' }} />
            </div>
            <div id={styles.sortOptionContainer}>
                {items.length !== 0 ? <span className={styles.itemsHeading}>Items for sale</span> : <span className={styles.itemsHeading}>No items listed</span>}
                <div>
                    <InputLabel id="sort">Sort by</InputLabel>
                    <Select
                        labelId="sort"
                        value={sort}
                        onChange={({ target }) => setSort(target.value)}
                        className={styles.sortSelect}
                    >
                        <MenuItem value='date'>Date</MenuItem>
                        <MenuItem value={'pricelh'}>Price (low to high)</MenuItem>
                        <MenuItem value={'pricehl'}>Price (high to low)</MenuItem>
                        <MenuItem value={'relevance'}>Relevance</MenuItem>
                    </Select>
                </div>
            </div>
            <Items items={items} />
            <div className={styles.spinnerContainer}>
                {loading && <CircularProgress />}
            </div>
            {maxItems && <Alert id={styles.alert} severity="info">No more items</Alert>}
        </div>
    )


}