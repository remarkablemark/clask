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
export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            messages: props.messages
        };
    }

    componentDidMount() {
        window.requirejs(['superagent'], (request) => {
            request.get('/api/messages', (error, response) => {
                if (error || !response.ok) {
                    return console.log(error, response); // eslint-disable-line no-console
                }
                this.setState({
                    messages: response.body,
                    isLoaded: true
                });
            });
        });
    }

    render() {
        const { isLoaded, messages } = this.state;
        if (!isLoaded) return null;
        return (
            <div>
                <MessageList messages={messages} />
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
