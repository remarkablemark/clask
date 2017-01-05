'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import { CHANNELS_TYPE } from './helpers';

/**
 * MenuDialog component.
 */
export default class MenuDialog extends React.Component {
    render() {
        const {
            onRequestClose,
            open,
            type
        } = this.props;

        const title = type === CHANNELS_TYPE ? 'CHANNELS' : 'DIRECT MESSAGES';

        return (
            <Dialog title={title} open={open} onRequestClose={onRequestClose}>
            </Dialog>
        );
    }
}

MenuDialog.propTypes = {
    onRequestClose: React.PropTypes.func,
    open: React.PropTypes.bool,
    type: React.PropTypes.string
};
