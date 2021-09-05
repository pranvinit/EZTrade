import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import styles from '../categories.module.css';
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
//importing presentational components
import Items from '../../../components/items/Items';
import AlertComponent from '../../../utils/AlertComponent';

export default function Category() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const category = location.pathname.split('/')[2]

    const [catItems, setCatItems] = useState([])

    useEffect(() => {
        const getCatItems = async () => {
            try {
                const response = await axios.get(`/category/${category}`)
                setCatItems(response.data)
                setLoading(false)
            }
            catch (err) {
                setOpen(true)
            }
        }
        getCatItems();
    }, [category])


    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    if (loading) {
        return (
            <div className={styles.spinnerContainer}>
                {loading && <CircularProgress />}
            </div>
        )
    }

    return (
        <div>
            <AlertComponent message={'Something went wrong'} operation={'warning'} open={open} changeOpen={changeOpen} />
            <span className={styles.categoryHeading}>{catItems.length} results for {category}</span>
            {catItems.length !== 0 ? <Items items={catItems} /> : <span id={styles.noResults}>Sorry, we couldn't find any results for {category}. Please search for a different category instead.</span>}
        </div>
    )

}
