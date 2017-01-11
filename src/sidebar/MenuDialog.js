'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import CreateChannel from '../rooms/CreateChannel';
import RoomFinder from '../rooms/RoomFinder';

// constants
import {
    CREATE_CHANNEL_TYPE,
    DIRECT_MESSAGES_TYPE
} from './helpers';

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
        rooms,
        title,
        type,
        users
    } = props;

    const isChannel = type !== DIRECT_MESSAGES_TYPE;

    let dataSource = [];
    if (isChannel) {
        dataSource = _.map(rooms, (value, key) => {
            return {
                text: rooms[key].name,
                value: key
            };
        });
    } else {
        dataSource = _.map(users, (value, key) => {
            return {
                text: users[key].username,
                value: key
            };
        });
    }

    let bodyNode;
    if (type === CREATE_CHANNEL_TYPE) {
        bodyNode = <CreateChannel onRequestClose={onRequestClose} />;
    } else {
        bodyNode = (
            <RoomFinder
                dataSource={dataSource}
                hintText='Find or start a conversation'
                onRequestClose={onRequestClose}
            />
        );
    }

    return (
        <Dialog
            title={title}
            open={open}
            onRequestClose={onRequestClose}
            titleStyle={titleStyle}
            bodyStyle={bodyStyle}>
            {bodyNode}
        </Dialog>
    );
}

MenuDialog.propTypes = {
    onRequestClose: React.PropTypes.func,
    open: React.PropTypes.bool,
    rooms: React.PropTypes.object,
    title: React.PropTypes.node,
    type: React.PropTypes.string,
    users: React.PropTypes.object
};
