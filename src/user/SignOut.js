'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import { connect } from 'react-redux';
import { removeUser } from './actions';
import SignIn from './SignIn';

// styles
const styles = {
    container: {
        height: '100%'
    }
};

/**
 * SignOut component.
 */
class SignOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSnackbarOpen: false,
            snackbarMessage: ''
        };
    }

    componentDidMount() {
        const {
            isAuthenticated,
            _removeUser
        } = this.props;

        if (!isAuthenticated) return;

        window.requirejs(['superagent'], (request) => {
            request.delete('/api/auth').end((error, response) => {
                // server error
                if (error || !response.ok) {
                    return this.setState({
                        snackbarMessage: 'Server error, please try again.',
                        isSnackbarOpen: true
                    });
                }

                // success
                _removeUser();
                this.setState({
                    snackbarMessage: response.body.message,
                    isSnackbarOpen: true
                });
            });
        });
    }

    render() {
        const {
            isSnackbarOpen,
            snackbarMessage
        } = this.state;
        return (
            <div style={styles.container}>
                <SignIn />
                <Snackbar
                    open={isSnackbarOpen}
                    message={snackbarMessage}
                />
            </div>
        );
    }
}

SignOut.propTypes = {
    isAuthenticated: React.PropTypes.bool,
    _removeUser: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.user.isAuthenticated
    };
}

function mapDispatchToProps(dispatch) {
    return {
        _removeUser: () => {
            dispatch(removeUser());
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignOut);
