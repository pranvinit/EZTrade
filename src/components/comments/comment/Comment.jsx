import React from 'react';
import styles from '../comments.module.css';

export default function Comment({ comments }) {
    return (
        <div id={styles.commentContainer}>
            {
                comments.slice().reverse().map((comment, index) => {
                    return (
                        <div id={styles.commentsContainer} key={index}>
                            <div id={styles.commentMeta}>
                                <span>{comment.name}</span>
                                <div>
                                    <span>{comment.time}</span>
                                    <span>{comment.date}</span>
                                </div>
                            </div>
                            <div id={styles.comment}>
                                <span>{comment.comment}</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
