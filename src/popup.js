import React from 'react';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import submit from './backend/oauth.js';
// import DateFnsUtils from '@date-io/date-fns';
// import {
//     DateTimePicker,
//     MuiPickersUtilsProvider,
// } from '@material-ui/pickers';

import './popup.css'

class Popup extends React.Component {
    constructor(props) {
        super(props);
        var setStart = props.startDate ? props.startDate : Date();
        var endStart = props.endDate ? props.endDate : Date();
        // If no time prop given, set to current date
        this.state = { eventName: "", startDate: setStart, endDate: endStart };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    // Update state when rerender is called in index.js
    componentWillReceiveProps(props) {
        console.log('received props: ');
        console.log(props);
        var setStart = props.startDate ? props.startDate : Date();
        var endStart = props.endDate ? props.endDate : Date();
        this.setState({ eventName: "", startDate: setStart, endDate: endStart })
    }

    // Send API request on click
    handleClick() {
        var eventName = this.state.eventName;
        submit(eventName);
    }

    //TODO: Add handleStartChange & handleEndChange which will default to current date/time when state is null
    //      to prevent overlap of label into mm/dd/yy

    render() {
        return (
            <Container maxWidth="xs" className="container">

                <TextField
                    onChange={e => this.setState({ eventName: e.target.value })}
                    id="eventName"
                    label="Event Name"
                    variant="standard"
                    margin="dense" />

                {/* TODO: switch to material-ui DateTimePicker */}
                {/* Make sure to fix time zone */}
                <TextField
                    className="text"
                    id="startDate"
                    label="Start date"
                    type="datetime-local"
                    value={this.state.startDate}
                    onChange={e => this.setState({ startDate: e.target.value })}
                    margin="dense"
                />
                <TextField
                    className="text"
                    id="endDate"
                    label="End date"
                    type="datetime-local"
                    value={this.state.endDate}
                    onChange={e => this.setState({ endDate: e.target.value })}
                    margin="dense"
                />
                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        className="text"
                        value={this.state.startDate}
                        onChange={e => this.setState({ startDate: e })}
                        label="Start date"
                        margin="dense"
                    />
                    <DateTimePicker
                        className="text"
                        value={this.state.endDate}
                        onChange={e => this.setState({ endDate: e })}
                        label="End date"
                        margin="dense"
                    />
                </MuiPickersUtilsProvider> */}

                <div className="buttonWrapper">
                    <Button id="submitButton" color="primary" variant="contained" size="small" endIcon={<EventAvailableIcon />} onClick={this.handleClick}>
                        Add Event
                    </Button>
                </div>

                {/* <h3>GCal API Response:</h3> */}
            </Container>
        );
    }
}

export default Popup;
