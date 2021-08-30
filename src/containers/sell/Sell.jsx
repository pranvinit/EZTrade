import React, { useState } from 'react';
import styles from './sell.module.css';
import moment from 'moment';
//redux specific
import { useSelector, useDispatch } from 'react-redux';
//material ui
import { Alert } from '@material-ui/lab';
import { Collapse } from '@material-ui/core';
import { Close, RestoreRounded } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
//form specific
import { ButtonGroup } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { AccountCircle, AddBox } from '@material-ui/icons';
import { PhotoCamera } from '@material-ui/icons';
import { AddCircleOutline } from '@material-ui/icons';
import axios from 'axios';


export default function Sell() {
    const sellerProfile = useSelector((state) => state.sellerAccount);
    const [formInput, setFormInput] = useState({});
    const [fileCount, setFileCount] = useState(0);

    const handleChange = ({ target }) => {
        const { name, value } = target;
        if (target.type == 'number') {
            setFormInput((prev) => ({
                ...prev,
                [name]: Number(value)
            }))
        }
        else {
            setFormInput((prev) => ({
                ...prev,
                [name]: value
            }))
        }

    }

    const handleGenderClick = ({ currentTarget }) => {
        setFormInput((prev) => ({
            ...prev,
            category: currentTarget.value
        }))
    }

    const handleFileChange = ({ target }) => {
        const fileArray = Array.from(target.files)

        setFormInput((prev) => ({
            ...prev,
            files: fileArray
        }))
        setFileCount(fileArray.length)
    }

    const [response, setResponse] = useState('')
    const [open, setOpen] = useState(false);
    const handleResponse = (res) => {
        setOpen(true);
        console.log(res.error)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const date = moment().format("MMM Do YY");
        const data = new FormData();
        data.append('date', date)
        Object.entries(formInput).map(item => {
            return data.append(item[0], item[1])
        })
        Object.entries(sellerProfile.data).map(item => {
            if (item[0] === '_id') {
                return data.append('sellerId', item[1])
            } else {
                return data.append(item[0], item[1])
            }
        })
        formInput.files.forEach(file => data.append('files', file))
        const addItem = async () => {
            try {
                const response = await axios({
                    method: 'POST',
                    url: '/addItem',
                    data: data
                });
                handleResponse(response)
            }
            catch (err) {
                console.log(err.response.status)
                setResponse('Failed to add item to the store')
            }

        }
        setFormInput({})
        setFileCount(0)
        addItem()
    }


    if (sellerProfile.hasFetched) {
        return (
            <div id={styles.mainContainer}>
                <div id={styles.sellerInfoContainer}>
                    <span id={styles.sellerGreeting}>Welcome back {sellerProfile.data.sellerName}</span>
                    <div id={styles.sellerOptions}>
                        <Button className={styles.sellerProfile} variant="contained" color="primary" size="large" startIcon={<AccountCircle />}>show your info</Button>
                        <Button className={styles.addItem} variant="contained" color="secondary" size="large" startIcon={<AddBox />}>add item</Button>
                    </div>
                </div>
                <div id={styles.sellerItems}>
                    <span>This will be a grid with the seller items</span>
                </div>
                <div id={styles.formContainer}>
                    <Collapse in={open}>
                        <Alert
                            severity={response.severity}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                >
                                    <Close fontSize="inherit" />
                                </IconButton>
                            }
                        >
                            {response.message}
                        </Alert>
                    </Collapse>
                    <form action="#" id={styles.addItemForm} onSubmit={handleSubmit}>
                        <span id={styles.signUpHeading}>Fill the form to add a new item</span>
                        <input className={styles.productTitle} type="text" name="title" onChange={handleChange} value={formInput.title || ''} placeholder="Product title" required />
                        <textarea className={styles.productDesc} type="text" name="description" onChange={handleChange} value={formInput.description || ''} placeholder="Product description" required />
                        <ButtonGroup size="large" color="secondary" aria-label="outlined primary button group">
                            <Button onClick={handleGenderClick} value="pantry" disabled={formInput.category === 'pantry'}>Pantry</Button>
                            <Button onClick={handleGenderClick} value="clothing" disabled={formInput.category === 'clothing'}>clothing</Button>
                            <Button onClick={handleGenderClick} value="electronics" disabled={formInput.category === 'electronics'}>Electronics</Button>
                            <Button onClick={handleGenderClick} value="food" disabled={formInput.category === 'food'}>Food</Button>
                            <Button onClick={handleGenderClick} value="jwellery" disabled={formInput.category === 'jwellery'}>Jwellery</Button>
                            <Button onClick={handleGenderClick} value="other" disabled={formInput.category === 'other'}>Other</Button>
                        </ButtonGroup>
                        <div className={styles.pricing}>
                            <input className={styles.price} type="number" name="price" onChange={handleChange} value={formInput.price || ''} placeholder="Price" min="0" step="10" required />
                            <input className={styles.discountedPrice} type="number" name="discountedPrice" onChange={handleChange} value={formInput.discountedPrice || ''} placeholder="Discounted price" min="0" step="10" required />
                        </div>
                        <div>
                            <input className={styles.fileInput} id="icon-button-file" type="file" name="images" onChange={handleFileChange} placeholder="Product images" required multiple />
                            <label htmlFor="icon-button-file">
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                            <span className={styles.fileCount}>{fileCount == 0 ? 'Click the icon to add images' : `${fileCount} images selected`}</span>
                        </div>
                        <textarea className={styles.productDetails} type="text" name="details" onChange={handleChange} value={formInput.details || ''} placeholder="Product details" required />
                        <Button size="large" startIcon={<AddCircleOutline style={{ color: 'white' }} />} className={styles.subBtn} variant="contained" color="secondary" type="submit">Add item</Button>
                    </form>
                </div>
            </div>
        )
    } else {
        return (
            <h1>Loading</h1>
        )
    }

}
