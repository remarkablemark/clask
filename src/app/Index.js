'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import Chat from '../chat/Chat';

/**
 * Index component.
 */
class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (!this.props.isAuthenticated) {
            browserHistory.push('/signin');
        }
    }

    render() {
        if (!this.props.isAuthenticated) return null;

        return (
            <Chat />
        );
    }
}

Index.propTypes = {
    isAuthenticated: React.PropTypes.bool
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.user.isAuthenticated
    };
}

export default connect(
    mapStateToProps
)(Index);
