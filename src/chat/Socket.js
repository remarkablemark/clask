'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Chat from './Chat';

/**
 * Socket component.
 */
export default class Socket extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoaded: false
        };
    }

    /**
     * Connect to socket.
     */
    componentDidMount() {
        window.requirejs(['io'], io => {
            const socket = io.connect();
            this.socket = socket;
            this.setState({
                isLoaded: true
            });
        });
    }

    /**
     * Disconnect from socket.
     */
    componentWillUnmount() {
        this.socket.disconnect();
    }

    render() {
        if (!this.state.isLoaded) return null;
        return <Chat socket={this.socket} />;
    }
}

Socket.propTypes = {
    children: React.PropTypes.node
};
