import React, { useState, useEffect } from 'react';
import { Fab } from '@material-ui/core';
import { ArrowBack, ArrowForwardIos } from '@material-ui/icons';
import styles from './featuredItem.module.css';

export default function FeaturedItem({ items }) {
    const [featuredItem, setfeaturedItem] = useState(2)
    const item = items[featuredItem];
    const discount = ((items[featuredItem].price - items[featuredItem].discountedPrice) / items[featuredItem].price) * 100;

    const nextItem = () => {
        let currItem = featuredItem;
        let nextItem = ++currItem % 5;
        setfeaturedItem(nextItem)
    }
    const previousItem = () => {
        if (featuredItem) {
            let currItem = featuredItem;
            let previousItem = --currItem % 5;
            setfeaturedItem(previousItem)
        }
        else {
            setfeaturedItem(4)
        }
    }

    useEffect(() => {
        const interval = setInterval(nextItem, 2000)
        return () => clearInterval(interval)
    })

    return (
        <div id={styles.featuredItemsContainer}>
            <Fab onClick={previousItem}>
                <ArrowBack />
            </Fab>
            <div id={styles.featuredImgDiv}>
                <img src={item.paths[0]} alt={item.title} />
            </div>
            <div id={styles.featuredItemInfo}>
                <span id={styles.featuredItemShopName}>From {item.sellerShopName}</span>
                <span>{item.title.substr(0, 50)}</span>
                <span>{item.description.substr(0, 180)}</span>
            </div>
            <div id={styles.featuredItemPrice}>
                <span>special price</span>
                <span>{discount.toFixed(0)} % off</span>
                <div>
                    <span>&#8377;{item.discountedPrice}</span>
                    <span>&#8377;{item.price}</span>
                </div>
            </div>
            <Fab onClick={nextItem}>
                <ArrowForwardIos />
            </Fab>
        </div>
    )
}
