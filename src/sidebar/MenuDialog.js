'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

// components
import Dialog from 'material-ui/Dialog';
import CreateChannel from '../rooms/CreateChannel';
import RoomFinder from '../rooms/RoomFinder';

// constants
import { CREATE_CHANNEL_TYPE } from './helpers';

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
        title,
        type,
    } = props;

    return (
        <Dialog
            title={title}
            open={open}
            onRequestClose={onRequestClose}
            titleStyle={titleStyle}
            bodyStyle={bodyStyle}>
            {type === CREATE_CHANNEL_TYPE ? (
                <CreateChannel
                    onRequestClose={onRequestClose}
                />
            ) : (
                <RoomFinder
                    hintText='Find or start a conversation'
                    onRequestClose={onRequestClose}
                    type={type}
                />
            )}
        </Dialog>
    );
}

MenuDialog.propTypes = {
    onRequestClose: React.PropTypes.func,
    open: React.PropTypes.bool,
    title: React.PropTypes.node,
    type: React.PropTypes.string
};
