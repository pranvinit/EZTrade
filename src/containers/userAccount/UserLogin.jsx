import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router';
import styles from './userAccount.module.css';

//form specific
import { Button } from '@material-ui/core';
import { VpnKey } from '@material-ui/icons';
//importing utils
import AlertComponent from '../../utils/AlertComponent';

//importing async thunks
import { fetchUserProfile } from './userAccountSlice';

export default function UserLogin() {
    const [formInput, setFormInput] = useState({});
    const history = useHistory();
    const dispatch = useDispatch();

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setFormInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const [response, setResponse] = useState({})
    console.log(response)

    const handleResponse = (data) => {
        setResponse((prev) => ({
            ...prev,
            message: data.message,
            auth: data.authentication
        }))
        setOpen(true);
        if (data.authentication) {
            console.log(data.jwtToken)
            localStorage.setItem('userJwtToken', data.jwtToken);
            dispatch(fetchUserProfile(localStorage.getItem('userJwtToken')));
            setTimeout(() => {
                history.push('/');
            }, 2000)
        }
    }
    const handleError = (err) => {
        if (err.status == 404) {
            setResponse((prev) => ({
                ...prev,
                message: 'User doesn\'t exist',
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
                    url: '/userLogin',
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
