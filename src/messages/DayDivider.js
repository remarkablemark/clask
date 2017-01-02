'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Divider from 'material-ui/Divider';
import { formatDate } from './helpers';

// styles
import { gutter } from '../shared/styles';
const dateSize = 16;
const styles = {
    root: {
        margin: `${gutter}px 0`
    },
    container: {
        position: 'absolute',
        right: 0,
        left: 0,
        marginTop: -dateSize / 2,
        textAlign: 'center'
    },
    date: {
        backgroundColor: '#fff',
        fontSize: dateSize,
        fontWeight: 'bold',
        padding: '0 1em'
    }
};

/**
 * DayDivider component.
 */
export default function DayDivider(props) {
    return (
        <div style={styles.root}>
            <div style={styles.container}>
                <strong style={styles.date}>
                    {formatDate(props.date)}
                </strong>
            </div>
            <Divider />
        </div>
    );
}

DayDivider.propTypes = {
    date: React.PropTypes.instanceOf(Date)
};
