'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

// components
import LeftNav from './LeftNav';
import MessageList from '../messages/MessageList';
import Form from './Form';

// redux
import { connect } from 'react-redux';
import { removeUser } from '../user/actions';

// styles
import { leftNavWidth } from '../shared/styles';
const styles = {
    container: {
        height: '100%'
    },
    content: {
        position: 'relative',
        marginLeft: leftNavWidth,
        height: '100%'
    }
};

/**
 * Chat component.
 */
function Chat(props) {
    const {
        messages,
        removeUser,
        socket,
        user,
        users
    } = props;

    return (
        <div style={styles.container}>
            <LeftNav
                activeRoom={user.rooms.active}
                rooms={user.sidebar}
                users={users}
            />
            <div style={styles.content}>
                <MessageList
                    messages={messages[user.rooms.active]}
                    removeUser={removeUser}
                    socket={socket}
                    users={users}
                />
                <Form
                    activeRoom={user.rooms.active}
                    socket={socket}
                    userId={user._id}
                />
            </div>
        </div>
    );
}

Chat.propTypes = {
    messages: React.PropTypes.object,
    removeUser: React.PropTypes.func,
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

Chat.defaultProps = {
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
        removeUser: (user) => {
            dispatch(removeUser(user));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);
