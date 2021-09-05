import React from 'react';
import { Link } from 'react-router-dom';
import styles from './categories.module.css';

import electronics from './media/electronics.jpg';
import clothing from './media/clothing.jpg';
import food from './media/food.jpg';
import jwellery from './media/jwellery.jpg';
import pantry from './media/pantry.jpg';
import other from './media/other.jpg';

export default function Categories() {
    return (
        <div id={styles.catgoriesContainer}>
            <div className={styles.categoryEntry}>
                <Link to="/category/pantry" style={{ textDecoration: 'none', color: 'black' }}>
                    <img src={pantry} alt="category-electronics" />
                    <span>Pantry</span>
                </Link>
            </div>
            <div className={styles.categoryEntry} >
                <Link to="/category/clothing" style={{ textDecoration: 'none', color: 'black' }}>
                    <img src={clothing} alt="category-clothing" />
                    <span>Clothing</span>
                </Link>
            </div>
            <div className={styles.categoryEntry} >
                <Link to="/category/electronics" style={{ textDecoration: 'none', color: 'black' }}>
                    <img src={electronics} alt="category-electronics" />
                    <span>Electronics</span>
                </Link>
            </div>
            <div className={styles.categoryEntry} >
                <Link to="/category/food" style={{ textDecoration: 'none', color: 'black' }}>
                    <img src={food} alt="category-food" />
                    <span>food</span>
                </Link>
            </div>
            <div className={styles.categoryEntry} >
                <Link to="/category/jwellery" style={{ textDecoration: 'none', color: 'black' }}>
                    <img src={jwellery} alt="category-jwellery" />
                    <span>Jwellery</span>
                </Link>
            </div>
            <div className={styles.categoryEntry} >
                <Link to="/category/other" style={{ textDecoration: 'none', color: 'black' }}>
                    <img src={other} alt="category-other" />
                    <span>Other</span>
                </Link>
            </div>
        </div>
    )
}

