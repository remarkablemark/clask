'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import Form from './Form';
import Redirect from '../shared/Redirect';
import {
    isValid,
    validateOnServer
} from './helpers';

// material-ui
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

// redux
import { connect } from 'react-redux';
import { setUser } from './actions';

/**
 * SignUp component.
 */
class SignUp extends React.Component {
    constructor(props) {
        super(props);
        const state = {
            isFormDisabled: false,
            isSnackbarOpen: false,
            snackbarMessage: ''
        };
        const inputFields = [
            'name',
            'username',
            'email',
            'password'
        ];
        _.forEach(inputFields, (key) => {
            state[key] = '';
            state[key + 'Error'] = '';
        });
        this._inputFields = inputFields;
        this.state = state;
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    /**
     * Handles the submit event for the form.
     *
     * @param {Object} event - The event.
     */
    _handleSubmit(event) {
        event.preventDefault();

        // validate all form inputs (email has HTML5 validation)
        let hasError = false;
        _.forEach(this._inputFields, (field) => {
            if (!isValid.call(this, field, this.state[field])) {
                hasError = true;
            }
        });
        if (hasError) return false;

        // disable form inputs
        this.setState({
            isFormDisabled: true
        });

        // make POST request
        window.requirejs(['superagent'], (request) => {
            const { name, username, email, password } = this.state;
            request
                .post('/api/users')
                .send({
                    name,
                    username,
                    email,
                    password
                })
                .end((err, response) => {
                    if (err || !response.ok) {
                        console.log(err, response); // eslint-disable-line no-console
                        return this.setState({
                            snackbarMessage: 'Server error, please try again.',
                            isSnackbarOpen: true,
                            isFormDisabled: false
                        });
                    }

                    const { success, message, user, error } = response.body;

                    // success: redirect to main
                    if (success) {
                        this.props._setUser(user);
                        this.setState({
                            snackbarMessage: message,
                            isSnackbarOpen: true
                        });
                        setTimeout(() => {
                            browserHistory.push('/');
                        }, 1000);

                    // error: display error text
                    } else if (error) {
                        this.setState({
                            [error.field + 'Error']: error.text,
                            isFormDisabled: false
                        });
                    }
                });
        });
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

        // client-side validation
        isValid.call(this, field, value);

        // server-side validation
        // for `username` and `email`
        if (value && (field === 'username' || field === 'email')) {
            validateOnServer(field, value, (error, response) => {
                if (error || !response.ok) {
                    return console.log(error, response); // eslint-disable-line no-console
                }

                // key found
                if (response.body.length) {
                    this.setState({
                        [field + 'Error']: (
                            field === 'username' ?
                            'Name is taken.' :
                            'Email already exists.'
                        )
                    });
                }
            });
        }
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
            passwordError,
            isFormDisabled,
            isSnackbarOpen,
            snackbarMessage
        } = this.state;

        return (
            <Redirect authenticatedTo='/'>
                <Form heading='Create Account' onSubmit={this._handleSubmit}>
                    {/* name */}
                    <TextField
                        floatingLabelText='Name'
                        hintText='Full Name'
                        value={name}
                        onChange={this._handleChange.bind(this, 'name')}
                        errorText={nameError}
                        disabled={isFormDisabled}
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
                        disabled={isFormDisabled}
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
                        disabled={isFormDisabled}
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
                        disabled={isFormDisabled}
                    />
                    <br />
                    <br />

                    <RaisedButton
                        type='submit'
                        label='Sign Up'
                        primary={true}
                        disabled={isFormDisabled}
                    />
                    <br />
                    <br />

                    <Snackbar
                        open={isSnackbarOpen}
                        message={snackbarMessage}
                    />
                </Form>
            </Redirect>
        );
    }
}

SignUp.propTypes = {
    _setUser: React.PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        _setUser: (user) => {
            dispatch(setUser(user));
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(SignUp);
