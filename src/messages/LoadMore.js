'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

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

/**
 * LoadMore component.
 */
export default function LoadMore(props) {
    if (!props.hasMore) return null;
    return (
        <div style={containerStyle}>
            <a style={linkStyle}>
                Load more&hellip;
            </a>
        </div>
    );
}

LoadMore.propTypes = {
    hasMore: React.PropTypes.bool
};
