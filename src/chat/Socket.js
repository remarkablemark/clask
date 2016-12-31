'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';

// components
import Chat from './Chat';

// socket
import {
    USERS
} from '../../socket.io/events';

// redux
import { connect } from 'react-redux';
import { setUsers } from '../users/actions';

/**
 * Socket component.
 */
class Socket extends React.Component {
    constructor() {
        super();
        this.events = [];
        this.state = {
            isLoaded: false
        };
    }

    /**
     * Connect to socket and listen to socket events.
     */
    componentDidMount() {
        window.requirejs(['io'], io => {
            const socket = io.connect();
            this.socket = socket;

            // set users data (e.g., connect/disconnect)
            socket.on(USERS, users => this.props.setUsers(users));
            this.events.push(USERS);

            this.setState({
                isLoaded: true
            });
        });
    }

    /**
     * Remove event listeners and disconnect from socket.
     * This will prevent memory leaks.
     */
    componentWillUnmount() {
        _.forEach(this.events, eventName => {
            this.socket.off(eventName);
        });
        this.socket.disconnect();
    }

    render() {
        if (!this.state.isLoaded) return null;
        return <Chat socket={this.socket} />;
    }
}

Socket.propTypes = {
    children: React.PropTypes.node,
    setUsers: React.PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        setUsers: (users) => {
            dispatch(setUsers(users));
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(Socket);
