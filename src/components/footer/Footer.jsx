import React from 'react';
import styles from './footer.module.css';
import { Instagram, YouTube, Twitter } from '@material-ui/icons';

export default function Footer() {
    return (
        <div id={styles.mainFooter}>
            <div id={styles.copyInfo}>
                <span>&copy; 2021 ezTrade - ezTrade Interactive application by Pranav Yeole</span>
            </div>
            <div id={styles.socialsContainer}>
                <ul id={styles.socialsUl}>
                    <a href="https://www.instagram.com/_pranv_/">
                        <li><Instagram className={`${styles.ig} ${styles.socials}`} fontSize="medium" /></li>
                    </a>
                    <a href="https://www.youtube.com/channel/UC-n2pLjaBS7s72Fgtwsun7Q">
                        <li><YouTube className={`${styles.yt} ${styles.socials}`} fontSize="medium" /></li>
                    </a>
                    <a href="https://twitter.com/pranv21">
                        <li><Twitter className={`${styles.twt} ${styles.socials}`} fontSize="medium" /></li>
                    </a>
                </ul>
            </div>
        </div>
    )
}
