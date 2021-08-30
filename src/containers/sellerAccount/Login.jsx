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

//login failed alert
import { Alert } from '@material-ui/lab';
import { IconButton } from '@material-ui/core';
import { Collapse } from '@material-ui/core';
import { Close } from '@material-ui/icons';


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

    const [show, setShow] = useState(false);
    const [response, setResponse] = useState({})

    const handleResponse = (data) => {
        setResponse((prev) => ({
            ...prev,
            message: data.message,
            authentication: data.authentication
        }))
        setShow(true);
        if (data.authentication) {
            localStorage.setItem('jwtToken', data.jwtToken);
            dispatch(fetchSellerProfile(localStorage.getItem('jwtToken')));
            setTimeout(() => {
                history.push('/sell');
            }, 2000)
        }
        setFormInput({});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const checkAuth = async () => {
            const response = await axios({
                method: 'POST',
                url: '/sellerLogin',
                data: formInput
            })
            handleResponse(response.data)
        }
        checkAuth();
        setOpen(true);

    }

    const [open, setOpen] = useState(true);
    return (
        <div id={styles.loginContainer}>
            {show && <Collapse in={open}>
                <Alert
                    severity={response.authentication ? 'success' : 'warning'}
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
            </Collapse>}
            <form action="#" onSubmit={handleSubmit} id={styles.loginForm}>
                <span id={styles.loginHeading}>Fill the form to log in</span>
                <input className={styles.loginUsername} type="text" name="username" onChange={handleChange} value={formInput.username || ''} placeholder="Username" required />
                <input className={styles.loginPassword} type="password" name="password" onChange={handleChange} value={formInput.password || ''} placeholder="Password" required />
                <Button size="large" startIcon={<VpnKey style={{ color: 'white' }} />} className={styles.subBtn} variant="contained" color="primary" type="submit">Submit</Button>
            </form>
        </div>
    )
}
