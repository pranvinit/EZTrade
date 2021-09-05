import React, { useState } from 'react';
import axios from 'axios';
import styles from './userAccount.module.css';

//importing login component
import UserLogin from './UserLogin'
//material ui specific
import { Button, ButtonGroup } from '@material-ui/core';
import { Save } from '@material-ui/icons';

//importing utils
import AlertComponent from '../../utils/AlertComponent';

export default function UserAccount() {
    const [loginOption, setLoginOption] = useState(true)
    const [formInput, setFormInput] = useState({})

    const [response, setResponse] = useState({})
    const handleResponse = (res) => {
        if (res.auth) {
            setResponse(prev => ({
                ...prev,
                message: res.message,
                operation: 'success'
            }))
            setTimeout(() => {
                setLoginOption(true)
            }, 2000)
        } else {
            setResponse(prev => ({
                ...prev,
                message: res.message,
                operation: 'warning'
            }))
        }
    }
    const handleError = (err) => {
        setResponse(prev => ({
            ...prev,
            message: 'Failed to add user',
            operation: 'warning'
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const addUser = async () => {
            try {
                const response = await axios({
                    method: 'POST',
                    url: '/addUser',
                    data: formInput
                });
                handleResponse(response.data)

            } catch (err) {
                handleError(err.response)
            }
        }
        addUser();
        setOpen(true);
        setFormInput({});
    }

    const handleChange = ({ target }) => {
        const { name, value } = target;
        if (name === 'age' || name === 'userContact') {
            setFormInput((prev) => ({
                ...prev,
                [name]: Number(value),
            }))
        } else {
            setFormInput((prev) => ({
                ...prev,
                [name]: value
            }))
        }
    }
    const handleGenderClick = ({ currentTarget }) => {
        setFormInput((prev) => ({
            ...prev,
            gender: currentTarget.value
        }))
    }

    const handleLoginOption = () => {
        loginOption ? setLoginOption(false) : setLoginOption(true);
        window.scrollTo(0, 0)
    }
    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    return (
        <div id={styles.mainContainer}>
            {loginOption && <UserLogin />}
            {!loginOption && <div id={styles.signUpContainer}>
                <AlertComponent message={response.message} operation={response.operation} open={open} changeOpen={changeOpen} />
                <form action="#" onSubmit={handleSubmit} id={styles.signUpForm}>
                    <span id={styles.signUpHeading}>Fill the form to setup your user profile</span>
                    <div className={styles.generalInfo}>
                        <input className={styles.smallInput} type="text" name="username" onChange={handleChange} value={formInput.username || ''} placeholder="Username" minLength="5" required />
                        <input className={styles.smallInput} type="password" name="password" onChange={handleChange} value={formInput.password || ''} placeholder="Password" minLength="5" required />
                    </div>
                    <input className={styles.nameInput} type="text" name="name" onChange={handleChange} value={formInput.name || ''} placeholder="Name" required />

                    <div className={styles.generalInfo}>
                        <ButtonGroup className={styles.userGender} size="large" color="primary" aria-label="outlined primary button group">
                            <Button onClick={handleGenderClick} value="male" disabled={formInput.gender === 'male'}>Male</Button>
                            <Button onClick={handleGenderClick} value="female" disabled={formInput.gender === 'female'}>Female</Button>
                            <Button onClick={handleGenderClick} value="other" disabled={formInput.gender === 'other'}>Other</Button>
                        </ButtonGroup>
                        <input className={`${styles.smallInput} ${styles.ageInput}`} type="number" name="age" onChange={handleChange} value={formInput.age || ''} placeholder="Age" min="0" required />
                    </div>
                    <div className={styles.generalInfo}>
                        <input className={styles.smallInput} type="tel" name="userContact" onChange={handleChange} value={formInput.userContact || ''} placeholder="Phone number" pattern="[7-9]{1}[0-9]{9}" required />
                        <input className={styles.smallInput} type="email" name="userEmail" onChange={handleChange} value={formInput.userEmail || ''} placeholder="Email" required />
                    </div>
                    <textarea className={styles.addressInput} name="userAddress" onChange={handleChange} value={formInput.userAddress || ''} placeholder="Address" required></textarea>
                    <Button size="large" startIcon={<Save style={{ color: 'white' }} />} className={styles.subBtn} variant="contained" color="secondary" type="submit">Submit</Button>
                </form>
            </div>}
            <div id={styles.option}>
                <Button variant="outlined" color="primary" style={{ marginTop: 50, marginBottom: 30 }} size="large" onClick={handleLoginOption}>{loginOption ? 'Login' : 'Don\'t have an account? sign up'}</Button>
            </div>
        </div>
    )
}
