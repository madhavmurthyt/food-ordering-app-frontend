import React from 'react';

import {
    Snackbar,
    IconButton
} from '@mui/material';

import Close from '@mui/icons-material/Close';

// Component for Snackerbar section
export default function Notification(props) {

    return (
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'left',}} open={props.open}
                  autoHideDuration={2500} onClose={props.onClose} message={props.messageText}
                  action={<IconButton size="small" color="inherit" onClick={props.onClose}><Close
                      fontSize="small"/></IconButton>}/>
    );
}
