'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import MessageList from './MessageList';
import Form from './Form';

/**
 * Chat component.
 */
export default function Chat(props) {
    return (
        <div>
            <MessageList messages={props.messages} />
            <Form />
        </div>
    );
}

Chat.propTypes = {
    messages: React.PropTypes.array
};

Chat.defaultProps = {
    messages: []
};
