import React from 'react';
import styles from './items.module.css';

//importing child components
import Item from './item/Item'

export default function Items({ items, seller, editItem, deleteItem }) {

    return (
        <div id={styles.itemsContainer}>
            {
                items.map((item, index) => {
                    return <Item key={index} item={item} seller={seller} editItem={editItem} deleteItem={deleteItem} />
                })
            }

        </div>
    )
}
