'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { GET_MESSAGES } from '../../socket.io/events';

// styles
import { blue500 } from 'material-ui/styles/colors';
import { gutter } from '../shared/styles';

const containerStyle = {
    padding: `${gutter}px 0`,
    textAlign: 'center'
};

const linkStyle = {
    color: blue500,
    cursor: 'pointer',
    fontStyle: 'italic'
};

// spinner
const progressNode = (
    <CircularProgress size={35} thickness={2.5} />
);

/**
 * LoadMore component.
 */
export default class LoadMore extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: false
        };
        this._handleClick = this._handleClick.bind(this);
    }

    componentDidUpdate(prevProps) {
        // multiple messages prepended
        if (this.props.messagesCount - prevProps.messagesCount > 1) {
            this.setState({
                isLoading: false
            });
        }
    }

    _handleClick() {
        this.setState({
            isLoading: true
        });
        this.props.socket.emit(GET_MESSAGES, {
            before: this.props.date
        });
    }

    render() {
        if (!this.props.hasMore) return null;

        const moreNode = (
            <a style={linkStyle} onClick={this._handleClick}>
                Load more&hellip;
            </a>
        );

        return (
            <div style={containerStyle}>
                {!this.state.isLoading ? moreNode : progressNode}
            </div>
        );
    }
}

LoadMore.propTypes = {
    date: React.PropTypes.instanceOf(Date),
    hasMore: React.PropTypes.bool,
    messagesCount: React.PropTypes.number,
    socket: React.PropTypes.object
};
