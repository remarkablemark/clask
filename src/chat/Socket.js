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
    CONNECTED_USERS,
    DISCONNECTED_USER
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
        this.state = {
            isLoaded: false
        };
    }

    /**
     * Connect to socket and listen to socket events.
     */
    componentDidMount() {
        const { setUsers } = this.props;

        window.requirejs(['io'], io => {
            const socket = io.connect();
            this.socket = socket;

            // an array of user id(s)
            socket.on(CONNECTED_USERS, (userIds) => {
                let users = {};
                _.forEach(userIds, (userId) => {
                    users[userId] = {
                        isConnected: true
                    };
                })
                setUsers(users);
            });

            // user id disconnected
            socket.on(DISCONNECTED_USER, (userId) => {
                setUsers({
                    [userId]: {
                        isConnected: false
                    }
                });
            });

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
        _.forEach([
            CONNECTED_USERS,
            DISCONNECTED_USER
        ], eventName => {
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
