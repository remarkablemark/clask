'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import { changeRoom } from '../rooms/helpers';

// components
import FontIcon from 'material-ui/FontIcon';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import MenuDialog from './MenuDialog';

// constants
import {
    CREATE_CHANNEL_TYPE,
    CHANNELS_TYPE,
    DIRECT_MESSAGES_TYPE
}  from './helpers';

import {
    grey300,
    grey700,
    red500
} from 'material-ui/styles/colors';

import {
    dialogPadding,
    sidebarMenuItemHeight
} from '../shared/styles';

// styles
const menuBaseStyle = {
    minHeight: sidebarMenuItemHeight,
    lineHeight: sidebarMenuItemHeight
};

// e.g., CHANNELS
const menuHeaderStyle = _.assign({
    color: grey700,
    fontWeight: 'bold'
}, menuBaseStyle);

// e.g., #general
const menuItemStyle = _.assign({
    padding: '0 0.5em'
}, menuBaseStyle);

// mentions number
const iconStyle = {
    backgroundColor: red500,
    color: '#fff',
    lineHeight: '26px',
    margin: 0,
    textAlign: 'center',
    top: 5
};

const activeMenuStyle = _.assign({
    backgroundColor: grey300
}, menuItemStyle);

const newChannelButtonStyle = {
    position: 'absolute',
    right: dialogPadding
};

// menu header icon
const rightIcon = (
    <FontIcon style={{ fontSize: 22, margin: 6 }} className='material-icons'>
        add
    </FontIcon>
);

/**
 * SidebarMenu component.
 */
export default class SidebarMenu extends React.Component {
    constructor(props) {
        super();
        this.state = {
            dialogType: props.type,
            isDialogOpen: false
        };
        this._closeDialog = this._closeDialog.bind(this);
    }

    /**
     * Opens dialog when clicked.
     *
     * @param {String} dialogType - The dialog type.
     */
    _openDialog(dialogType) {
        this.setState({
            dialogType,
            isDialogOpen: true
        });
    }

    /**
     * Closes dialog.
     */
    _closeDialog() {
        this.setState({ isDialogOpen: false });
    }

    render() {
        const {
            activeRoomId,
            history,
            roomIds,
            roomPrefix,
            rooms,
            title,
            type,
            userId,
            users
        } = this.props;

        const { dialogType, isDialogOpen } = this.state;
        let dialogTitle;
        if (isDialogOpen) {
            if (dialogType === DIRECT_MESSAGES_TYPE) {
                dialogTitle = 'DIRECT MESSAGES';
            } else if (dialogType === CREATE_CHANNEL_TYPE) {
                dialogTitle = 'CREATE CHANNEL';
            } else if (dialogType === CHANNELS_TYPE) {
                dialogTitle = (
                    <div>
                        CHANNELS
                        <RaisedButton
                            label='NEW CHANNEL'
                            primary={true}
                            style={newChannelButtonStyle}
                            onClick={() => this._openDialog(CREATE_CHANNEL_TYPE)}
                        />
                    </div>
                );
            }
        }

        return (
            <Menu disableAutoFocus={true}>
                {/* title */}
                <MenuItem
                    primaryText={title}
                    rightIcon={rightIcon}
                    style={menuHeaderStyle}
                    onClick={() => this._openDialog(type)}
                />

                {/* rooms */}
                {_.map(roomIds, (roomId) => {
                    // channel has name
                    const room = rooms[roomId];
                    let roomName = _.get(room, 'name');

                    // direct message shows username(s)
                    if (type === DIRECT_MESSAGES_TYPE && _.isUndefined(roomName)) {
                        const usernames = [];
                        _.forEach(_.get(room, '_users'), (id) => {
                            // exclude current user
                            if (id !== userId) {
                                usernames.push(users[id].username);
                            }
                        });
                        roomName = usernames.join(', ');
                    }

                    // do not render if there is no room name
                    if (!roomName) return null;

                    const isActive = roomId === activeRoomId;

                    // mentions icon
                    const mentions = _.get(history, `${roomId}.mentions`);
                    const mentionsIcon = mentions > 0 ? (
                        <Paper circle={true} style={iconStyle}>
                            {mentions}
                        </Paper>
                    ) : undefined;

                    return (
                        <MenuItem
                            onClick={changeRoom.bind(this, roomId)}
                            rightIcon={mentionsIcon}
                            style={isActive ? activeMenuStyle : menuItemStyle}
                            key={roomId}>
                            {roomPrefix}
                            {roomName}
                        </MenuItem>
                    );
                })}

                {/* dialog */}
                {isDialogOpen && (
                    <MenuDialog
                        title={dialogTitle}
                        open={isDialogOpen}
                        onRequestClose={this._closeDialog}
                        type={dialogType}
                    />
                )}
            </Menu>
        );
    }
}

SidebarMenu.propTypes = {
    activeRoomId: React.PropTypes.string,
    history: React.PropTypes.object,
    roomIds: React.PropTypes.array,
    roomPrefix: React.PropTypes.node,
    rooms: React.PropTypes.object,
    setUser: React.PropTypes.func,
    socket: React.PropTypes.object,
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    users: React.PropTypes.object,
    userId: React.PropTypes.string
};
