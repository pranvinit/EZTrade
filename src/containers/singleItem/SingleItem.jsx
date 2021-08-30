import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import styles from './singleItem.module.css';
import axios from 'axios';

export default function SingleItem() {
    const location = useLocation();
    const itemId = location.pathname.split('/')[2];

    const [item, setItem] = useState({})
    console.log(item)

    const getItem = async () => {
        const response = await axios({
            method: 'POST',
            url: `/item/${itemId}`,
            data: { id: itemId }
        });
        setItem(response.data)
    }

    useEffect(() => {
        getItem()
    }, [itemId])
    return (
        <div>
            <span>{item.title}</span>
            <span>{item.date}</span>
            <span>{item.description}</span>
            <span>{item.category}</span>
            <span>{item.details}</span>
            <span>{item.price}</span>
            <span>{item.discountedPrice}</span>
            <span>{item.sellerName}</span>
            <span>{item.sellerContact}</span>
            <span>{item.shopAddress}</span>
            {item.paths &&
                item.paths.map((path, index) => {
                    return <img src={path} alt={item.title} key={index} width="150px" />
                })
            }
        </div>
    )
}
