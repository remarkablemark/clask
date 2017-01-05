'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Dialog from 'material-ui/Dialog';

/**
 * MenuDialog component.
 */
export default class MenuDialog extends React.Component {
    render() {
        const {
            title,
            open,
            onRequestClose
        } = this.props;

        return (
            <Dialog
                title={title}
                open={open}
                onRequestClose={onRequestClose}
            />
        );
    }
}

MenuDialog.propTypes = {
    title: React.PropTypes.string,
    open: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func
};
