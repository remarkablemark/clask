'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Form from './Form';
import { isValid } from './helpers';

/**
 * SignUp component.
 */
export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        const state = {};
        const inputFields = [
            'name',
            'username',
            'email',
            'password'
        ];
        inputFields.forEach((key) => {
            state[key] = '';
            state[key + 'Error'] = '';
        });
        this._inputFields = inputFields;
        this.state = state;
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleSubmit(event) {
        event.preventDefault();

        // validate all form inputs (email has HTML5 validation)
        let hasError = false;
        this._inputFields.forEach((field) => {
            if (!isValid.call(this, field, this.state[field])) {
                hasError = true;
            }
        });
        if (hasError) return false;
    }

    /**
     * Handles and validates the changes of an input.
     *
     * @param {String} field - The input field.
     * @param {Object} event - The event.
     * @param {String} value - The input value.
     */
    _handleChange(field, event, value) {
        this.setState({
            [field]: value
        });
        isValid.call(this, field, value);
    }

    render() {
        const {
            name,
            username,
            email,
            password,
            nameError,
            usernameError,
            emailError,
            passwordError
        } = this.state;

        return (
            <Form heading='Create Account' onSubmit={this._handleSubmit}>
                {/* name */}
                <TextField
                    floatingLabelText='Name'
                    hintText='Full Name'
                    value={name}
                    onChange={this._handleChange.bind(this, 'name')}
                    errorText={nameError}
                    autoFocus
                    autoCorrect={false}
                    spellCheck={false}
                />
                <br />

                {/* username */}
                <TextField
                    floatingLabelText='Username'
                    hintText='Displayed to others'
                    value={username}
                    onChange={this._handleChange.bind(this, 'username')}
                    errorText={usernameError}
                    autoCorrect={false}
                    spellCheck={false}
                />
                <br />

                {/* email */}
                <TextField
                    type='email'
                    floatingLabelText='Email'
                    hintText='you@domain.com'
                    value={email}
                    onChange={this._handleChange.bind(this, 'email')}
                    errorText={emailError}
                />
                <br />

                {/* password */}
                <TextField
                    type='password'
                    floatingLabelText='Password'
                    hintText='Minimum 6 characters'
                    value={password}
                    onChange={this._handleChange.bind(this, 'password')}
                    errorText={passwordError}
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
