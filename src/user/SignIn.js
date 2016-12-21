'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Form from './Form';

/**
 * SignIn component.
 */
export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormDisabled: false
        };
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        const {
            isFormDisabled
        } = this.state;

        return (
            <Form heading='Login' onSubmit={this._handleSubmit}>
                {/* email */}
                <TextField
                    type='email'
                    floatingLabelText='Email'
                    hintText='you@domain.com'
                    disabled={isFormDisabled}
                />
                <br />

                {/* password */}
                <TextField
                    type='password'
                    floatingLabelText='Password'
                    disabled={isFormDisabled}
                />
                <br />
                <br />

                <RaisedButton
                    type='submit'
                    label='Sign In'
                    primary={true}
                    disabled={isFormDisabled}
                />
                <br />
                <br />
            </Form>
        );
    }
}
