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
import { appendMessages } from '../messages/actions';
import { removeUser } from '../user/actions';
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
            const events = [];

            const {
                appendMessages,
                removeUser,
                setUsers,
                user
            } = this.props;

            // disconnect user if unauthenticated
            socket.on(USER, (user) => {
                if (!user.isAuthenticated) {
                    removeUser();
                    browserHistory.push('/signin');
                }
            });
            events.push(USER);

            // update `users` when another user connects or disconnects
            socket.on(USERS, (users) => setUsers(users));
            events.push(USERS);

            // listen for chat messages
            socket.on(MESSAGE, (message) => {
                appendMessages(user.rooms.active, [message]);
            });
            events.push(MESSAGE);

            this.setState({
                isLoaded: true
            });
            this.events = events;
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

        const {
            messages,
            user,
            users
        } = this.props;

        return (
            <Chat
                activeRoom={user.rooms.active}
                messages={messages[user.rooms.active]}
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
    removeUser: React.PropTypes.func,
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
        removeUser: () => {
            dispatch(removeUser());
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
