import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addChange } from './searchBarSlice';
import styles from './searchBar.module.css';

//importing material ui components
import { Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

export default function SearchBar() {

    const searchQuery = useSelector(state => state.searchBar);
    const dispatch = useDispatch();
    console.log(searchQuery);

    const handleChange = ({ target }) => {
        dispatch(addChange(target.value))
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
