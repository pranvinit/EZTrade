import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import styles from './search.module.css';
import axios from 'axios';


//importing presentational components
import Items from '../items/Items';
//importing utils
import AlertComponent from '../../utils/AlertComponent';

//material ui specific
import { CircularProgress } from '@material-ui/core';

export default function Search() {
    const searchQuery = useSelector(state => state.searchQuery);
    const [loading, setLoading] = useState(true)

    const [response, setResponse] = useState({});

    useEffect(() => {
        if (searchQuery) {
            const search = async () => {
                try {
                    const response = await axios({
                        method: 'POST',
                        url: '/search',
                        data: { query: searchQuery }
                    });
                    setResponse(response.data)
                    setLoading(false)

                } catch (err) {
                    setLoading(false)
                    setOpen(true);
                }
            }
            search();

        }
    }, [])

    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    if (!searchQuery) {
        return (
            <div className={styles.centered}>
                <span>Please try a typing a query from the home page.</span>
            </div>
        )
    }
    else if (loading) {
        return (
            <div className={styles.centered}>
                <CircularProgress />
            </div>
        )
    }
    return (
        <div searchItemContainer>
            <AlertComponent message='Something went wrong' operation='warning' open={open} changeOpen={changeOpen} />
            <div id={styles.queryInfo}>
                <span id={styles.resultCount}>{response.length} results for {searchQuery}</span>
            </div>
            {response.length ? <Items items={response} /> : <span id={styles.noResults}>Sorry, we couldn't find any results for {searchQuery}. Please try a different query instead.</span>}
        </div>
    )
}
