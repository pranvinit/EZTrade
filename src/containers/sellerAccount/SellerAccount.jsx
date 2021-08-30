import React, { useState } from 'react';
import axios from 'axios';
import styles from './sellerAccount.module.css';

//form specific
import { ButtonGroup } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Save } from '@material-ui/icons';

//success alert specific
import { Alert } from '@material-ui/lab';
import { IconButton } from '@material-ui/core';
import { Collapse } from '@material-ui/core';
import { Close } from '@material-ui/icons';

//importing login component
import Login from './Login';

export default function SellerAccount() {

    const [loginOption, setLoginOption] = useState(false)
    const [formInput, setFormInput] = useState({})

    const handleChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'sellerContact') {
            setFormInput((prev) => ({
                ...prev,
                [name]: Number(value),
            }))
        } else {
            setFormInput((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    };

    const [response, setResponse] = useState({})
    const handleResponse = (res) => {
        setResponse(res);
        if (res.operation === 'success') {
            setTimeout(() => {
                setLoginOption(true)
            }, 2000)
        }
    }

    const handleGenderClick = ({ currentTarget }) => {
        setFormInput((prev) => ({
            ...prev,
            gender: currentTarget.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0)
        setFormInput({});
        const addSeller = async () => {
            const response = await axios({
                method: 'POST',
                url: '/addSeller',
                data: formInput
            });
            handleResponse(response.data)
        }
        addSeller();
        setFormInput({});
        setOpen(true);
    }

    const [open, setOpen] = useState(false);
    return (
        <div id={styles.mainContainer}>
            {loginOption && <Login />}
            {!loginOption && <div id={styles.signUpContainer}>
                <Collapse in={open}>
                    <Alert
                        severity={response.operation}
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
                <form action="#" onSubmit={handleSubmit} id={styles.addSellerForm}>
                    <span id={styles.signUpHeading}>Fill the form to setup your seller profile</span>
                    <div className={styles.generalInfo}>
                        <input className={styles.smallInput} type="text" name="username" onChange={handleChange} value={formInput.username || ''} placeholder="Username" minLength="5" pattern="[^' ']+" required />
                        <input className={`${styles.smallInput} ${styles.passwordInput}`} type="password" name="password" onChange={handleChange} value={formInput.password || ''} placeholder="Password" minLength="5" pattern="[^' ']+" required />
                    </div>
                    <input className={styles.shopNameInput} type="text" name="sellerShopName" onChange={handleChange} value={formInput.sellerShopName || ''} placeholder="Shop name" required />
                    <ButtonGroup size="large" color="primary" aria-label="outlined primary button group">
                        <Button onClick={handleGenderClick} value="male" disabled={formInput.gender === 'male'}>Male</Button>
                        <Button onClick={handleGenderClick} value="female" disabled={formInput.gender === 'female'}>Female</Button>
                        <Button onClick={handleGenderClick} value="other" disabled={formInput.gender === 'other'}>Other</Button>
                    </ButtonGroup>
                    <div className={styles.generalInfo}>
                        <input className={styles.smallInput} type="text" name="sellerName" onChange={handleChange} value={formInput.sellerName || ''} placeholder="Your name" required />
                        <input className={`${styles.smallInput} ${styles.telInput}`} type="tel" name="sellerContact" onChange={handleChange} value={formInput.sellerContact || ''} placeholder="Whatsapp" pattern="[7-9]{1}[0-9]{9}" required />
                    </div>
                    <input className={styles.emailInput} type="email" name="sellerEmail" onChange={handleChange} value={formInput.sellerEmail || ''} placeholder="Email" required />
                    <textarea className={styles.addressInput} name="shopAddress" onChange={handleChange} value={formInput.shopAddress || ''} placeholder="Shop address" required></textarea>
                    <Button size="large" startIcon={<Save style={{ color: 'white' }} />} className={styles.subBtn} variant="contained" color="primary" type="submit">Submit</Button>
                </form>
            </div>}
            <div id={styles.option}>
                <Button variant="outlined" color="secondary" style={{ margin: '50px 0' }} size="large" onClick={() => loginOption ? setLoginOption(false) : setLoginOption(true)}>{loginOption ? 'sign up' : 'Already have an account? login'}</Button>
            </div>
        </div>
    )
}
