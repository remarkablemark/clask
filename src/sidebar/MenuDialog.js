'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Dialog from 'material-ui/Dialog';

/**
 * MenuDialog component.
 */
export default function MenuDialog(props) {
    const {
        onRequestClose,
        open,
        title
    } = props;

    return (
        <Dialog title={title} open={open} onRequestClose={onRequestClose}>
            {props.children}
        </Dialog>
    );
}

MenuDialog.propTypes = {
    children: React.PropTypes.node,
    onRequestClose: React.PropTypes.func,
    open: React.PropTypes.bool,
    title: React.PropTypes.string
};
