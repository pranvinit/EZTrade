import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import styles from './sellerAccount.module.css';

//importing async thunk
import { fetchSellerProfile } from './sellerAccountSlice';
//form specific
import { Button } from '@material-ui/core';
import { VpnKey } from '@material-ui/icons';
//importing utils
import AlertComponent from '../../utils/AlertComponent';


export default function Login() {
    const dispatch = useDispatch();

    const [formInput, setFormInput] = useState({});
    const history = useHistory();

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setFormInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const [response, setResponse] = useState({})

    const handleResponse = (data) => {
        setResponse((prev) => ({
            ...prev,
            message: data.message,
            auth: data.authentication
        }))
        setOpen(true);
        if (data.authentication) {
            localStorage.setItem('sellerJwtToken', data.jwtToken);
            dispatch(fetchSellerProfile(localStorage.getItem('sellerJwtToken')));
            setTimeout(() => {
                history.push('/sell');
            }, 2000)
        }
    }
    const handleError = (err) => {
        if (err.status == 404) {
            setResponse((prev) => ({
                ...prev,
                message: 'Seller doesn\'t exist',
                auth: false
            }))
        }
        else if (err.status == 500) {
            setResponse((prev) => ({
                ...prev,
                message: 'Internal server error',
                auth: false
            }))
            setOpen(true)
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        const checkAuth = async () => {
            try {
                const response = await axios({
                    method: 'POST',
                    url: '/sellerLogin',
                    data: formInput
                })
                handleResponse(response.data)
            } catch (err) {
                handleError(err.response)
            }
        }
        checkAuth();
        setFormInput({});
        setOpen(true);

    }
    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);
    return (
        <div id={styles.loginContainer}>

            <AlertComponent message={response.message} operation={response.auth ? 'success' : 'warning'} open={open} changeOpen={changeOpen} />

            <form action="#" onSubmit={handleSubmit} id={styles.loginForm}>
                <span id={styles.loginHeading}>Fill the form to log in</span>
                <input className={styles.loginUsername} type="text" name="username" onChange={handleChange} value={formInput.username || ''} placeholder="Username" required />
                <input className={styles.loginPassword} type="password" name="password" onChange={handleChange} value={formInput.password || ''} placeholder="Password" required />
                <Button size="large" startIcon={<VpnKey style={{ color: 'white' }} />} className={styles.subBtn} variant="contained" color="primary" type="submit">Submit</Button>
            </form>
        </div>
    )
}
