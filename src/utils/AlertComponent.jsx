import React from 'react';

//success alert specific
import { Alert } from '@material-ui/lab';
import { IconButton } from '@material-ui/core';
import { Collapse } from '@material-ui/core';
import { Close } from '@material-ui/icons';

export default function AlertComponent({ message, operation, open, changeOpen }) {

    const handleOpen = () => {
        changeOpen(false)
    }

    return (
        <Collapse in={open}>
            <Alert
                severity={operation}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleOpen}
                    >
                        <Close fontSize="inherit" />
                    </IconButton>
                }
            >
                {message}
            </Alert>
        </Collapse>
    )
}
