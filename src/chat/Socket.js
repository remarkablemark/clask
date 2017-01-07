'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';

// components
import Chat from './Chat';

// redux
import { connect } from 'react-redux';
import {
    removeAll,
    setRooms,
    setUser,
    setUsers,
    updateMessages
} from '../actions';

// constants
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
        window.requirejs(['io'], io => {
            const socket = io.connect();
            this.socket = socket;
            this.events = [];

            const {
                removeAll,
                setRooms,
                setUser,
                setUsers,
                updateMessages
            } = this.props;

            /**
             * Set `user` when client connects.
             */
            socket.on(USER, (user) => {
                // disconnect user if unauthenticated
                if (!user.isAuthenticated) {
                    removeAll();
                    return browserHistory.push('/signin');
                }
                setUser(user);
            });
            this.events.push(USER);

            /**
             * Update `users` when user connects or disconnects.
             */
            socket.on(USERS, (users) => {
                setUsers(users);
            });
            this.events.push(USERS);

            /**
             * Set `rooms` joined by user.
             */
            socket.on(ROOMS, (rooms) => {
                setRooms(rooms);
            });
            this.events.push(ROOMS);

            /**
             * Listen for chat messages.
             */
            socket.on(MESSAGES, (messages) => {
                const roomId = _.get(messages, '[0]._room');
                if (roomId) updateMessages(roomId, messages);
            });
            this.events.push(MESSAGES);
        });
    }

    /**
     * Remove event listeners and disconnect from socket.
     * This will prevent memory leaks.
     */
    componentWillUnmount() {
        _.forEach(this.events, (eventName) => {
            this.socket.off(eventName);
        });
        this.socket.disconnect();
    }

    render() {
        const {
            messages,
            rooms,
            user,
            users
        } = this.props;

        const userRooms = _.get(user, 'rooms', {});
        const activeRoom = userRooms.active;
        const activeMessages = _.get(messages, activeRoom, []);

        // render only when loaded
        if (!user.isAuthenticated) return null;
        if (_.isEmpty(users)) return null;
        if (_.isEmpty(rooms)) return null;
        if (!activeRoom) return null;

        return (
            <Chat
                activeRoom={activeRoom}
                messages={activeMessages}
                rooms={rooms}
                sidebar={userRooms.sidebar}
                socket={this.socket}
                userId={user._id}
                users={users}
            />
        );
    }
}

Socket.propTypes = {
    messages: React.PropTypes.object,
    removeAll: React.PropTypes.func,
    rooms: React.PropTypes.object,
    setRooms: React.PropTypes.func,
    setUser: React.PropTypes.func,
    setUsers: React.PropTypes.func,
    socket: React.PropTypes.object,
    updateMessages: React.PropTypes.func,
    user: React.PropTypes.shape({
        _id: React.PropTypes.string,
        isAuthenticated: React.PropTypes.bool,
        rooms: React.PropTypes.shape({
            active: React.PropTypes.string,
            history: React.PropTypes.object,
            sidebar: React.PropTypes.shape({
                channels: React.PropTypes.array,
                directMessages: React.PropTypes.array
            })
        }),
        username: React.PropTypes.string
    }),
    users: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        messages: state.messages,
        rooms: state.rooms,
        user: state.user,
        users: state.users
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeAll: () => {
            dispatch(removeAll());
        },
        setRooms: (rooms) => {
            dispatch(setRooms(rooms));
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Socket);
