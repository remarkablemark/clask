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

        const {
            messages,
            removeUser,
            user,
            users
        } = this.props;

        return (
            <Chat
                activeRoom={user.rooms.active}
                messages={messages[user.rooms.active]}
                removeUser={removeUser}
                sidebar={user.sidebar}
                socket={this.socket}
                userId={user._id}
                users={users}
            />
        );
    }
}

Socket.propTypes = {
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
