'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';

// components
import Chat from '../chat/Chat';

// redux
import { connect } from 'react-redux';
import {
    removeAll,
    setRooms,
    setSocket,
    setUser,
    setUsers,
    updateMessages
} from '../actions';

// socket events
import {
    MESSAGES,
    ROOMS,
    USER,
    USERS
} from '../../socket.io/events';

/**
 * Socket component.
 */
class Socket extends React.Component {
    /**
     * Connect to socket and listen to socket events.
     */
    componentDidMount() {
        window.requirejs(['io'], (io) => {
            const {
                isAuthenticated,
                removeAll,
                setRooms,
                setUser,
                setUsers,
                setSocket,
                updateMessages
            } = this.props;

            const socket = io.connect();
            setSocket(socket);
            this.socket = socket;
            const events = [];

            /**
             * Set `user` when client connects.
             */
            socket.on(USER, (user) => {
                // disconnect user if unauthenticated
                if (user.isAuthenticated === false) {
                    removeAll();
                    return browserHistory.push('/signin');
                    socket.disconnect();
                }
                setUser(user);
            });
            events.push(USER);

            /**
             * Update `users` when user connects or disconnects.
             */
            socket.on(USERS, (users) => {
                setUsers(users);
            });
            events.push(USERS);

            /**
             * Set `rooms` joined by user.
             */
            socket.on(ROOMS, (rooms) => {
                setRooms(rooms);
            });
            events.push(ROOMS);

            /**
             * Listen for chat messages.
             */
            socket.on(MESSAGES, (messages) => {
                const roomId = _.get(messages, '[0]._room');
                if (roomId) updateMessages(roomId, messages);
            });
            events.push(MESSAGES);

            /**
             * Handle disconnect.
             */
            socket.on('disconnect', () => {
                if (isAuthenticated) return socket.io.reconnect();
                else removeAll();
            });
            events.push('disconnect');

            // cache socket event names
            this.events = events;
        });
    }

    /**
     * Remove event listeners and disconnect from socket.
     * This will prevent memory leaks.
     */
    componentWillUnmount() {
        const { events, socket } = this;
        _.forEach(events, (eventName) => {
            socket.off(eventName);
        });
        socket.disconnect();
    }

    render() {
        if (!this.props.isAuthenticated) return null;
        return <Chat />;
    }
}

Socket.propTypes = {
    isAuthenticated: React.PropTypes.bool,
    removeAll: React.PropTypes.func,
    setRooms: React.PropTypes.func,
    setSocket: React.PropTypes.func,
    setUser: React.PropTypes.func,
    setUsers: React.PropTypes.func,
    updateMessages: React.PropTypes.func
};

Socket.defaultProps = {
    isAuthenticated: false
};

function mapDispatchToProps(dispatch) {
    return {
        removeAll: () => {
            dispatch(removeAll());
        },
        setRooms: (rooms) => {
            dispatch(setRooms(rooms));
        },
        setSocket: (socket) => {
            dispatch(setSocket(socket));
        },
        setUser: (user) => {
            dispatch(setUser(user));
        },
        setUsers: (users) => {
            dispatch(setUsers(users));
        },
        updateMessages: (room, messages) => {
            dispatch(updateMessages(room, messages));
        }
    };
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.user.isAuthenticated
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Socket);
