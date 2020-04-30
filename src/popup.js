import React from 'react';
import TextField from '@material-ui/core/TextField'
import SubmitButton from './submitButton.js';
import './popup.css'
import Button from '@material-ui/core/Button';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import submit from './backend/oauth.js';
var chrono = require('chrono-node');

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { eventName: "" };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        var startDate = document.getElementById('startDate').attributes.value;
        var eventName = this.state.eventName;
        submit(eventName);
    }

    render() {
        return (
            <>
                <h3>Selected Text:</h3>
                <p id="output"></p>

                <h3>Predicted date range (chrono):</h3>

                <h3>Predicted event name:</h3>
                <p id="event"></p>
                <TextField onChange={e => this.setState({ eventName: e.target.value })} id="eventName" label="Event Name" variant="standard" />

                <h3>Predicted location:</h3>
                <p id="location"></p>

                <TextField
                    id="startDate"
                    label="Event start date"
                    type="datetime-local"
                    defaultValue="2020-04-29T10:30"
                />
                <TextField
                    id="endDate"
                    label="Event end date"
                    type="datetime-local"
                    defaultValue="2020-04-30T10:30"

                />

                <Button id="submitButton" color="primary" variant="contained" size="small" endIcon={<EventAvailableIcon />} onClick={this.handleClick}>
                    Add Event
                </Button>

                <h3>GCal API Response:</h3>
                <p id="response"></p>
            </>
        );
    }
}

export default Popup;
