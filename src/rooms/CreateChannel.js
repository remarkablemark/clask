'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

// styles
import { gutter } from '../shared/styles';
const buttonStyle = {
    float: 'right'
};
const lastButtonStyle = _.assign({
    marginLeft: gutter / 2
}, buttonStyle);

/**
 * CreateChannel component.
 */
export default class CreateChannel extends React.Component {
    constructor() {
        super();
        this.state = {
            isPublic: false,
            name: ''
        };
        this._handleChange = this._handleChange.bind(this);
        this._handleToggle = this._handleToggle.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    /**
     * Listens to input change.
     *
     * @param {Object} event - The event.
     * @param {String} name  - The input value.
     */
    _handleChange(event, name) {
        this.setState({ name });
    }

    /**
     * Listens to input change.
     *
     * @param {Object} event    - The event.
     * @param {String} isPublic - The toggle value.
     */
    _handleToggle(event, isPublic) {
        this.setState({ isPublic });
    }

    /**
     * Create channel on form submission.
     *
     * @param {Object} event - The event.
     */
    _handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this._handleSubmit}>
                <TextField
                    floatingLabelText='Channel Name'
                    fullWidth={true}
                    value={this.state.name}
                    onChange={this._handleChange}
                    autoFocus
                />
                <br />
                <br />

                <Toggle
                    label='Public (anyone can join)'
                    labelPosition='right'
                    onToggle={this._handleToggle}
                    toggled={this.state.isPublic}
                />
                <br />
                <br />

                <RaisedButton
                    label='Create Channel'
                    type='submit'
                    primary={true}
                    style={lastButtonStyle}
                />
                <RaisedButton
                    label='Cancel'
                    onClick={this.props.onRequestClose}
                    style={buttonStyle}
                />
            </form>
        );
    }
}

CreateChannel.propTypes = {
    onRequestClose: React.PropTypes.func
};
