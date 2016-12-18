'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Message from './Message';
import Form from './Form';

// styles
import { formHeight, gutter } from './styles';
const styles = {
    container: {
        position: 'absolute',
        right: 0,
        bottom: formHeight,
        left: 0,
        margin: gutter,
        overflowY: 'auto'
    }
};

/**
 * Chat component.
 */
export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages
        };
    }

    componentDidMount() {
        window.requirejs(['socket'], (socket) => {
            socket.on('chat:message', (message) => {
                this.setState({
                    messages: this.state.messages.concat([message])
                });
            });
        });
    }

    render() {
        const { messages } = this.state;
        return (
            <div>
                <div style={styles.container}>
                    {messages.map((message, index) => {
                        return <Message key={index} message={message} />;
                    })}
                </div>
                <Form />
            </div>
        );
    }
}

Chat.propTypes = {
    messages: React.PropTypes.array
};

Chat.defaultProps = {
    messages: []
};
