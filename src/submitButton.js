import React from 'react';
import Button from '@material-ui/core/Button';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

class SubmitButton extends React.Component {
    render() {
        return (
            <Button id="submitButton" color="primary" variant="contained" size="small" endIcon={<EventAvailableIcon />}>
                Add Event
            </Button>
        );
    }
}

export default SubmitButton;