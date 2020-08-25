/* globals chrome */
import React from 'react';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import CircularProgress from '@material-ui/core/CircularProgress';
import submit from './backend/oauth.js';
// import DateFnsUtils from '@date-io/date-fns';
// import {
//     DateTimePicker,
//     MuiPickersUtilsProvider,
// } from '@material-ui/pickers';

import './popup.css'
require("@gouch/to-title-case");

class Popup extends React.Component {
    constructor(props) {
        super(props);
        var setStart = props.startDate ? props.startDate : new Date();
        var endStart = props.endDate ? props.endDate : new Date();
        var nameStart = props.eventName ? props.eventName : '';
        // If no time prop given, set to current date
        this.state = {
            eventName: nameStart,
            startDate: setStart,
            endDate: endStart,
            loading: false,
            complete: false,
            msg: null
        };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.done = this.done.bind(this);
    }

    // Add listener when component mounts
    componentDidMount() {
        chrome.runtime.onMessage.addListener(this.handleMessage);
    }
    // Remove listener when this component unmounts
    componentWillUnmount() {
        chrome.runtime.onMessage.removeListener(this.handleMessage);
    }


    handleMessage(request, sender, sendResponse) {
        if (request.msg == "api response") {
            console.log("Popup received confirmation");
            console.log(request.data);
            this.setState({ complete: true, msg: request.data });
        }
    }

    // Update state when rerender is called in index.js
    componentWillReceiveProps(props) {
        console.log('received props: ');
        console.log(props);
        // var setStart = props.startDate ? props.startDate : Date();
        // var endStart = props.endDate ? props.endDate : Date();
        // this.setState({ eventName: props.eventName, startDate: setStart, endDate: endStart })
        this.setState({ eventName: props.eventName.toTitleCase(), startDate: props.startDate, endDate: props.endDate })
    }

    // Send API request on click
    handleClick() {
        this.setState({ loading: true })
        submit(this.state.eventName);
    }

    //TODO: Add handleStartChange & handleEndChange which will default to current date/time when state is null
    //      to prevent overlap of label into mm/dd/yy

    main() {
        return (
            <Container className="container" fixed >
                <TextField
                    onChange={e => this.setState({ eventName: e.target.value })}
                    id="eventName"
                    label="Event Name"
                    variant="standard"
                    margin="dense"
                    value={this.state.eventName} />

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

                <div className="buttonWrapper">
                    <Button id="submitButton" color="primary" variant="contained" size="small" endIcon={<EventAvailableIcon />} onClick={this.handleClick}>
                        Add Event
                    </Button>
                </div>

            </Container>
        );
    }

    loading() {
        return (
            <div className="spacer">
                <span>
                    <CircularProgress />
                </span>
            </div>
        );
    }

    done() {
        console.log(this.state.msg.htmlLink)
        return (
            <div className="spacer">
                <span>
                    {this.state.msg.status == 'confirmed' ?
                        <h1>Your <a href={this.state.msg.htmlLink} target="_blank" rel="noopener noreferrer" >event</a> has been confirmed!</h1> :
                        <h1>Event creation failed! </h1>
                    }

                </span>
            </div>
        )
    }

    render() {
        return (
            this.state.complete ? this.done() : this.state.loading ? this.loading() : this.main()
        );
    }
}

export default Popup;
