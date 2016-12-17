'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

/**
 * Form component.
 */
export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this._handleChange = this._handleChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    _handleSubmit(event) {
        event.preventDefault();
        window.requirejs(['socket'], (socket) => {
            socket.emit('chat:message', this.state.value);
            this.setState({
                value: ''
            });
        });
    }

    render() {
        return (
            <form onSubmit={this._handleSubmit}>
                <input type='text' value={this.state.value} onChange={this._handleChange} />
                <input type='submit' value='Enter' />
            </form>
        );
    }
}
