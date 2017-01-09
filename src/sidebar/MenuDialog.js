'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Dialog from 'material-ui/Dialog';

// styles
import { dialogPadding } from '../shared/styles'
const titleStyle = {
    padding: dialogPadding,
    paddingBottom: 0
};
const bodyStyle = {
    padding: dialogPadding,
    paddingTop: 0
};

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
        <Dialog
            title={title}
            open={open}
            onRequestClose={onRequestClose}
            titleStyle={titleStyle}
            bodyStyle={bodyStyle}>
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
