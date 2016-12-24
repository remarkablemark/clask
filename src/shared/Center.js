'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

// styles
const styles = {
    table: {
        display: 'table',
        width: '100%',
        height: '100%'
    },
    cell: {
        display: 'table-cell',
        textAlign: 'center',
        verticalAlign: 'middle',
    }
};

/**
 * Center component.
 *
 * https://css-tricks.com/centering-in-the-unknown/#article-header-id-1
 */
export default function Center(props) {
    return (
        <div style={styles.table}>
            <div style={styles.cell}>
                {props.children}
            </div>
        </div>
    );
}

Center.propTypes = {
    children: React.PropTypes.node
};
