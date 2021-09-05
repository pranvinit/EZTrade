import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import styles from './comments.module.css';
import { Button } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import axios from 'axios';
import AlertComponent from '../../utils/AlertComponent';
//for autosizing comment area
import autosize from "autosize";
//importing single comments
import Comment from './comment/Comment';

export default function Comments({ item, reload }) {
    const userProfile = useSelector(state => state.userAccount);
    const userData = userProfile.data;
    const [formInput, setFormInput] = useState('')

    const handleChange = ({ target }) => {
        const { value } = target;
        setFormInput(value)
    }
    const commentInput = useRef();
    useEffect(() => {
        autosize(commentInput.current)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const commentDate = moment().format("MMM Do YY");
        const commentTime = moment().format('LT');
        const data = { id: item._id, name: userData.name, userId: userData._id, date: commentDate, time: commentTime, comment: formInput }
        const addComment = async () => {
            try {
                await axios({
                    method: 'POST',
                    url: '/review',
                    data: { type: 'comment', data: data }
                });
                reload()

            } catch (err) {
                setOpen(true)
            }
        }
        addComment();
        setFormInput('')
    }
    const [open, setOpen] = useState(false);
    const changeOpen = () => setOpen(false);

    const [showComments, setShowComments] = useState(false);
    return (
        <div id={styles.commentSection}>
            <AlertComponent message={'Failed to add comment'} operation={'warning'} open={open} changeOpen={changeOpen} />
            {userProfile.login && <form action="#" onSubmit={handleSubmit} id={styles.commentForm}>
                <textarea ref={commentInput} id={styles.commentInput} name="comment" placeholder="Add a public comment.." onChange={handleChange} value={formInput} required rows="1"></textarea>
                <Button variant="contained" color="primary" endIcon={<Send />} type="submit">Send</Button>
            </form>}
            <div><Button variant="outlined" size="large" color="secondary" onClick={() => showComments ? setShowComments(false) : setShowComments(true)}>{showComments ? 'Hide comments' : 'Show comments'}</Button></div>
            {showComments && <Comment comments={item.comments} />}
        </div>
    )
}
