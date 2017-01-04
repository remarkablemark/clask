'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

// components
import LeftNav from '../sidebar/LeftNav';
import MessageList from '../messages/MessageList';
import Form from './Form';

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
export default function Chat(props) {
    const {
        activeRoom,
        messages,
        sidebar,
        socket,
        userId,
        users
    } = props;

    return (
        <div style={styles.container}>
            <LeftNav
                activeRoom={activeRoom}
                rooms={sidebar}
                users={users}
            />
            <div style={styles.content}>
                <MessageList
                    messages={messages}
                    socket={socket}
                    users={users}
                />
                <Form
                    activeRoom={activeRoom}
                    hasMessages={messages.length !== 0}
                    socket={socket}
                    userId={userId}
                />
            </div>
        </div>
    );
}

Chat.propTypes = {
    activeRoom: React.PropTypes.string,
    messages: React.PropTypes.array,
    sidebar: React.PropTypes.shape({
        channels: React.PropTypes.array,
        directMessages: React.PropTypes.array
    }),
    socket: React.PropTypes.object,
    userId: React.PropTypes.string,
    users: React.PropTypes.object
};
