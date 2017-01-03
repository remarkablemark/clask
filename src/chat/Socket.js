'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';

// components
import Chat from './Chat';

// socket
import {
    MESSAGE,
    USER,
    USERS
} from '../../socket.io/events';

// redux
import { connect } from 'react-redux';
import {
    appendMessages,
    removeAll,
    setUser,
    setUsers
} from '../actions';

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
                appendMessages,
                removeAll,
                setUser,
                setUsers
            } = this.props;

            // update `user` when client connects
            socket.on(USER, (user) => {
                // disconnect user if unauthenticated
                if (!user.isAuthenticated) {
                    removeAll();
                    return browserHistory.push('/signin');
                }
                setUser(user);
            });
            this.events.push(USER);

            // update `users` when another user connects or disconnects
            socket.on(USERS, (users) => {
                setUsers(users);
            });
            this.events.push(USERS);

            // listen for chat messages
            socket.on(MESSAGE, (messages) => {
                appendMessages(messages[0].room_id, messages);
            });
            this.events.push(MESSAGE);
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
            user,
            users
        } = this.props;
        const activeRoom = _.get(user, 'rooms.active', null);

        if (!user.isAuthenticated) return null;
        if (!activeRoom) return null;
        if (_.isEmpty(users)) return null;

        return (
            <Chat
                activeRoom={activeRoom}
                messages={messages[activeRoom]}
                sidebar={user.sidebar}
                socket={this.socket}
                userId={user._id}
                users={users}
            />
        );
    }
}

Socket.propTypes = {
    appendMessages: React.PropTypes.func,
    messages: React.PropTypes.object,
    removeAll: React.PropTypes.func,
    setUser: React.PropTypes.func,
    setUsers: React.PropTypes.func,
    socket: React.PropTypes.object,
    user: React.PropTypes.shape({
        _id: React.PropTypes.string,
        isAuthenticated: React.PropTypes.bool,
        rooms: React.PropTypes.shape({
            active: React.PropTypes.string,
            history: React.PropTypes.object
        }),
        sidebar: React.PropTypes.shape({
            channels: React.PropTypes.array,
            directMessages: React.PropTypes.array
        }),
        username: React.PropTypes.string
    }),
    users: React.PropTypes.object
};

Socket.defaultProps = {
    messages: {},
    user: {
        isAuthenticated: false,
        rooms: {
            active: 'general'
        },
        sidebar: {
            channels: ['general'],
            directMessages: []
        }
    },
    users: {}
};

function mapStateToProps(state) {
    return {
        messages: state.messages,
        user: state.user,
        users: state.users
    };
}

function mapDispatchToProps(dispatch) {
    return {
        appendMessages: (room, messages) => {
            dispatch(appendMessages(room, messages));
        },
        removeAll: () => {
            dispatch(removeAll());
        },
        setUser: (user) => {
            dispatch(setUser(user));
        },
        setUsers: (users) => {
            dispatch(setUsers(users));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Socket);
