'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';

// components
import FontIcon from 'material-ui/FontIcon';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MenuDialog from './MenuDialog';
import RoomFinder from './RoomFinder';
import CreateChannel from './CreateChannel';

// constants
import { grey300, grey700 } from 'material-ui/styles/colors';
import {
    dialogPadding,
    sidebarMenuItemHeight
} from '../shared/styles';
import {
    CHANNELS_TYPE,
    CREATE_CHANNEL_TYPE,
    DIRECT_MESSAGES_TYPE
} from './helpers';

// styles
const menuBaseStyle = {
    minHeight: sidebarMenuItemHeight,
    lineHeight: sidebarMenuItemHeight
};

const menuHeaderStyle = _.assign({
    color: grey700,
    fontWeight: 'bold'
}, menuBaseStyle);

const menuItemStyle = _.assign({
    padding: '0 0.5em'
}, menuBaseStyle);

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
    constructor() {
        super();
        this.state = {
            dialogType: '',
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
            activeRoom,
            roomIds,
            roomPrefix,
            rooms,
            title,
            type,
            users
        } = this.props;

        const { dialogType, isDialogOpen } = this.state;
        let dialogNode;

        if (isDialogOpen) {
            const isChannel = dialogType !== DIRECT_MESSAGES_TYPE;
            let dialogTitle = !isChannel && 'DIRECT MESSAGES';
            if (dialogType === CHANNELS_TYPE) {
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
            } else if (dialogType === CREATE_CHANNEL_TYPE) {
                dialogTitle = 'CREATE CHANNEL';
            }

            const dataSource = isChannel ? _.map(rooms, (value, key) => {
                return {
                    text: rooms[key].name,
                    value: key
                };
            }) : _.map(users, (value, key) => {
                return {
                    text: users[key].username,
                    value: key
                };
            });

            dialogNode = (
                <MenuDialog
                    onRequestClose={this._closeDialog}
                    open={isDialogOpen}
                    title={dialogTitle}>
                    {dialogType === CREATE_CHANNEL_TYPE ? (
                        <CreateChannel
                            onRequestClose={this._closeDialog}
                        />
                    ) : (
                        <RoomFinder
                            dataSource={dataSource}
                            hintText='Find or start a conversation'
                            onRequestClose={this._closeDialog}
                        />
                    )}
                </MenuDialog>
            );
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
                    const style = (
                        roomId === activeRoom ?
                        activeMenuStyle :
                        menuItemStyle
                    );
                    return (
                        <MenuItem style={style} key={roomId}>
                            {roomPrefix}
                            {rooms[roomId].name}
                        </MenuItem>
                    );
                })}

                {/* dialog */}
                {dialogNode}
            </Menu>
        );
    }
}

SidebarMenu.propTypes = {
    activeRoom: React.PropTypes.string,
    roomIds: React.PropTypes.array,
    roomPrefix: React.PropTypes.node,
    rooms: React.PropTypes.object,
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    users: React.PropTypes.object
};
