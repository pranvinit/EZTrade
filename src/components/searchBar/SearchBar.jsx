import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeQuery } from './searchBarSlice';
import styles from './searchBar.module.css';

//importing material ui components
import { Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

export default function SearchBar() {

    const searchQuery = useSelector(state => state.searchQuery);
    const dispatch = useDispatch();

    const handleChange = ({ target }) => {
        dispatch(changeQuery(target.value))
    }

    const handleSearchClick = () => {
        if (searchQuery) {
            //logic to filter out products with search Input field
        }
    }

    return (
        <div>
            <div id={styles.searchBarContainer}>
                <input className={styles.searchInput} type="text" placeholder="Search..." onChange={handleChange} />
                <Button className={styles.searchIconContainer} onClick={handleSearchClick}><SearchIcon fontSize="large" /></Button>
            </div>
        </div>
    )
}
