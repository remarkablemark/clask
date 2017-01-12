'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

/**
 * Redirect component.
 */
class Redirect extends React.Component {
    constructor() {
        super();
        this._handleRedirect = this._handleRedirect.bind(this);
    }

    componentDidMount() {
        this._handleRedirect();
    }

    componentDidUpdate() {
        this._handleRedirect();
    }

    _handleRedirect() {
        const {
            isAuthenticated,
            authenticatedTo,
            unauthenticatedTo
        } = this.props;

        if (isAuthenticated && authenticatedTo) {
            browserHistory.push(authenticatedTo);
        } else if (!isAuthenticated && unauthenticatedTo) {
            browserHistory.push(unauthenticatedTo);
        }
    }

    render() {
        const {
            isAuthenticated,
            authenticatedTo,
            children
        } = this.props;

        if (!isAuthenticated && !authenticatedTo) return null;
        return children;
    }
}

Redirect.propTypes = {
    authenticatedTo: React.PropTypes.string,
    unauthenticatedTo: React.PropTypes.string,
    isAuthenticated: React.PropTypes.bool,
    children: React.PropTypes.node
};

function mapStateToProps(state) {
    return {
        isAuthenticated: state.user.isAuthenticated
    };
}

export default connect(
    mapStateToProps
)(Redirect);
