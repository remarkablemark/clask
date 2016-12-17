'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

/**
 * Message component.
 */
export default function Message(props) {
    return (
        <div>
            {props.message}
        </div>
    );
}

Message.propTypes = {
    message: React.PropTypes.string
};
