'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Center from './Center';

// styles
import { grey700 } from 'material-ui/styles/colors';
import { gutter } from '../chat/styles';
const styles = {
    heading: {
        color: grey700
    },
    container: {
        margin: '0 auto',
        maxWidth: 400
    },
    content: {
        margin: `0 ${gutter / 2}px`
    }
};

/**
 * SignUp component.
 */
export default class SignUp extends React.Component {
    render() {
        return (
            <Center>
                <form style={styles.container}>
                    {/* heading */}
                    <h1 style={styles.heading}>
                        Create Account
                    </h1>

                    <Paper style={styles.content}>
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
                    </Paper>
                </form>
            </Center>
        );
    }
}
