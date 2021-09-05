import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './rating.module.css';
import axios from 'axios';
import AlertComponent from '../../utils/AlertComponent';
//material ui specific
import { Box, Button } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { FavoriteBorder } from '@material-ui/icons';


export default function Ratings({ item, reload }) {
    const userData = useSelector(state => state.userAccount.data);
    const [value, setValue] = useState(0)
    const handleClick = () => {
        if (value) {
            const addRating = async () => {
                const data = { id: item._id, name: userData.name, userId: userData._id, rating: value }
                try {
                    await axios({
                        method: 'POST',
                        url: '/review',
                        data: { type: 'rating', data: data }
                    })
                    reload()

                } catch {
                    setOpen(true)
                    setDisabled(false);
                }

            }
            addRating();
            setDisabled(true)
        }
    }

    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    //to avoid rating multiple times
    const [rated, setRated] = useState(false)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        item.ratings.map(user => {
            if (user.userId.includes(userData._id)) {
                setDisabled(true);
                setRated(true);
            }
        })
    }, [userData, item])


    return (
        <div id={styles.ratingContainer}>
            <AlertComponent message={'Failed to add rating'} operation={'warning'} open={open} changeOpen={changeOpen} />
            <div id={styles.ratingInfo}>
                {rated && <span id={styles.rated}>You rated</span>}
                <Box component="fieldset" mb={5} borderColor="transparent" style={{ marginBottom: 0 }}>
                    <Rating
                        name="simple-controlled"
                        value={rated ? item.ratings.find(user => user.userId === userData._id).rating : value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        style={{ fontSize: 50 }}
                        disabled={disabled}
                    />
                </Box>
                <Button onClick={handleClick} variant="contained" color="secondary" endIcon={<FavoriteBorder />} disabled={disabled} style={{ marginLeft: 50 }}>Rate</Button>
            </div>
        </div>
    )
}
