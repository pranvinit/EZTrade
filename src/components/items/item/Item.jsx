import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from '../items.module.css';
import { ShoppingCart } from '@material-ui/icons';
import { Payment } from '@material-ui/icons';
import { Fab } from '@material-ui/core';

//import link from react router
import { Link } from 'react-router-dom';


export default function Item({ item }) {
    const userProfile = useSelector((state) => state.userAccount);

    const discount = ((item.price - item.discountedPrice) / item.price) * 100;
    const [counter, setCounter] = useState(false);
    const [imgIndex, setImgIndex] = useState(0);
    const imgIntervalRef = useRef();

    const nextImg = () => {
        let currIndex = imgIndex;
        let nextIndex = ++currIndex % item.paths.length;
        setImgIndex(nextIndex)
    }

    useEffect(() => {
        if (counter) {
            imgIntervalRef.current = setInterval(nextImg, 2000)
        }
        return () => {
            clearInterval(imgIntervalRef.current)
        }
    })
    const handleMouseOut = () => {
        setCounter(false);
        setImgIndex(0);
    }

    return (
        <div id={styles.itemEntry}>
            <Link className={styles.singleItemLink} to={`/singleItem/${item._id}`}>
                <div id={styles.itemTitleContainer}>
                    <span>{item.title.substr(0, 50)}</span>
                </div>
                <div id={styles.itemPriceContainer}>
                    <span>&#8377;{item.discountedPrice}</span>
                    <span>&#8377;{item.price}</span>
                    <span>{discount.toFixed(0)}% off</span>
                </div>
                <div id={styles.itemImageDiv} onMouseOver={() => setCounter(true)} onMouseOut={handleMouseOut}>
                    <img src={item.paths[imgIndex]} alt={item.title} width="150px" />
                </div></Link>
            <div id={styles.itemOptionsContainer}>
                <span>{item.category}</span>
                <div>
                    <Fab disabled={!userProfile.login} color="primary" size="small" aria-label="edit">
                        <ShoppingCart />
                    </Fab>
                    <Fab disabled={!userProfile.login} color="primary" size="small" aria-label="edit">
                        <Payment />
                    </Fab>
                </div>
            </div>
            <Link className={styles.singleItemLink} to={`/singleItem/${item._id}`}>
                <div id={styles.itemReviewContainer}>
                    <span className={styles.review}>4.5</span>
                    <span className={styles.review}> 20 reviews</span>
                </div>
            </Link>
        </div>
    )
}
