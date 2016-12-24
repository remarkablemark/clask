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
            isLoaded: 0,
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
                    isLoaded: this.state.isLoaded + 1
                });
            });

            request.get('/api/users', (error, response) => {
                if (error || !response.ok) {
                    return console.log(error, response); // eslint-disable-line no-console
                }

                // reformat collection into hash
                const users = {};
                response.body.forEach((user) => {
                    const { _id, username } = user;
                    users[_id] = {
                        username
                    };
                });

                this.setState({
                    users,
                    isLoaded: this.state.isLoaded + 1
                });
            });
        });
    }

    render() {
        const { isLoaded, messages, users } = this.state;
        if (isLoaded < 2) return null;

        return (
            <div>
                <MessageList messages={messages} users={users} />
                <Form />
            </div>
        );
    }
}

Chat.propTypes = {
    messages: React.PropTypes.array,
    users: React.PropTypes.object
};

Chat.defaultProps = {
    messages: [],
    users: {}
};
