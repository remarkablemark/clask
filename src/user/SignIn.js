'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Form from './Form';

/**
 * SignIn component.
 */
export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormDisabled: false,
            isSnackbarOpen: false,
            snackbarMessage: ''
        };
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    /**
     * Log out (destroy session) if route path is `/signout`.
     */
    componentDidMount() {
        const { route } = this.props;
        if (route.path === '/signout') {
            window.requirejs(['superagent'], (request) => {
                request
                    .delete('/api/auth')
                    .end((error, response) => {
                        // server error
                        if (error || !response.ok) {
                            return this.setState({
                                snackbarMessage: 'Server error, please try again.',
                                isSnackbarOpen: true
                            });
                        }

                        // success
                        this.setState({
                            snackbarMessage: response.body.message,
                            isSnackbarOpen: true
                        });
                    });
            });
        }
    }

    /**
     * Submit form data to `/api/auth` to create authenticated session.
     */
    _handleSubmit(event) {
        event.preventDefault();

        const email = this.refs.email.input.value;
        const password = this.refs.password.input.value;

        this.setState({
            isFormDisabled: true
        });

        window.requirejs(['superagent'], (request) => {
            request
                .post('/api/auth')
                .send({
                    email,
                    password
                })
                .end((error, response) => {
                    // server error
                    if (error || !response.ok) {
                        return this.setState({
                            snackbarMessage: 'Server error, please try again.',
                            isSnackbarOpen: true,
                            isFormDisabled: false
                        });
                    }

                    const { success, message } = response.body;

                    // success
                    if (success) {
                        browserHistory.push('/');

                    // error
                    } else if (message) {
                        this.setState({
                            snackbarMessage: message,
                            isSnackbarOpen: true,
                            isFormDisabled: false
                        });
                    }
                });
        });
    }

    render() {
        const {
            isFormDisabled,
            isSnackbarOpen,
            snackbarMessage
        } = this.state;

        return (
            <Form heading='Login' onSubmit={this._handleSubmit}>
                {/* email */}
                <TextField
                    ref='email'
                    type='email'
                    floatingLabelText='Email'
                    hintText='you@domain.com'
                    disabled={isFormDisabled}
                />
                <br />

                {/* password */}
                <TextField
                    ref='password'
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

                <Snackbar
                    open={isSnackbarOpen}
                    message={snackbarMessage}
                />
            </Form>
        );
    }
}

SignIn.propTypes = {
    route: React.PropTypes.shape({
        path: React.PropTypes.string
    })
};
