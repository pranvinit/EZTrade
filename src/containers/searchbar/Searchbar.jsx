import React from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { changeQuery } from './searchbarSlice';
import styles from './searchbar.module.css';

//importing material ui components
import { Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

export default function Searchbar() {

    const searchQuery = useSelector(state => state.searchQuery);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleChange = ({ target }) => {
        dispatch(changeQuery(target.value))
    }

    const handleSearchClick = () => {
        if (searchQuery) {
            history.push('/search')
        }
    }
    const handleEnter = ({ key }) => {
        if (key === 'Enter') {
            handleSearchClick();
        }
    }

    return (
        <div>
            <div id={styles.searchBarContainer}>
                <input onKeyPress={handleEnter} className={styles.searchInput} type="text" placeholder="Search..." onChange={handleChange} />
                <Button className={styles.searchIconContainer} onClick={handleSearchClick}><SearchIcon fontSize="large" /></Button>
            </div>
        </div>
    )
}
