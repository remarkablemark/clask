'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Form from './Form';

/**
 * SignUp component.
 */
export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <Form heading='Create Account' onSubmit={this._handleSubmit}>
                {/* name */}
                <TextField
                    floatingLabelText='Name'
                    hintText='Full Name'
                />
                <br />

                {/* username */}
                <TextField
                    floatingLabelText='Username'
                />
                <br />

                {/* email */}
                <TextField
                    type='email'
                    floatingLabelText='Email'
                    hintText='you@domain.com'
                />
                <br />

                {/* password */}
                <TextField
                    type='password'
                    floatingLabelText='Password'
                />
                <br />
                <br />

                <RaisedButton
                    type='submit'
                    label='Sign Up'
                    primary={true}
                />
                <br />
                <br />
            </Form>
        );
    }
}
