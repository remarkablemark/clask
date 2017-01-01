'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { browserHistory } from 'react-router';
import Form from './Form';

// material-ui
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

// redux
import { connect } from 'react-redux';
import { setUser } from './actions';
import { setUsers } from '../users/actions';
import { appendMessages } from '../messages/actions';

/**
 * SignIn component.
 */
class SignIn extends React.Component {
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
            request.post('/api/auth').send({
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

                const {
                    success,
                    message,
                    messages,
                    user,
                    users
                } = response.body;

                // success
                if (success) {
                    this.props.setUser(user);
                    this.props.setUsers(users);
                    this.props.appendMessages(user.rooms.active, messages);
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
                    autoFocus
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
    appendMessages: React.PropTypes.func,
    setUser: React.PropTypes.func,
    setUsers: React.PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        appendMessages: (room, messages) => {
            dispatch(appendMessages(room, messages));
        },
        setUser: (user) => {
            dispatch(setUser(user));
        },
        setUsers: (users) => {
            dispatch(setUsers(users));
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(SignIn);
