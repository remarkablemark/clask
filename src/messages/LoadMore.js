'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

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
export default function LoadMore(props) {
    const {
        hasMore,
        isLoading,
        onClick
    } = props;

    if (!hasMore) return null;

    const moreNode = (
        <a style={linkStyle} onClick={onClick}>
            Load more&hellip;
        </a>
    );

    return (
        <div style={containerStyle}>
            {!isLoading ? moreNode : progressNode}
        </div>
    );
}

LoadMore.propTypes = {
    hasMore: React.PropTypes.bool,
    isLoading: React.PropTypes.bool,
    onClick: React.PropTypes.func
};
