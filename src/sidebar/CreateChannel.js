'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import _ from 'lodash';

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
        this.state = { value: '' };
        this._handleChange = this._handleChange.bind(this);
    }

    /**
     * Listens to input change.
     *
     * @param {Object} event - The event.
     * @param {String} value - The input value.
     */
    _handleChange(event, value) {
        this.setState({ value });
    }

    render() {
        return (
            <form>
                <TextField
                    floatingLabelText='Channel Name'
                    fullWidth={true}
                    value={this.state.value}
                    onChange={this._handleChange}
                    autoFocus
                />
                <br />
                <br />

                <RaisedButton
                    label='Create Channel'
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
