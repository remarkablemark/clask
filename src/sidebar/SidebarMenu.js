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

// constants
import {
    CREATE_CHANNEL_TYPE,
    CHANNELS_TYPE,
    DIRECT_MESSAGES_TYPE
}  from './helpers';
import { UPDATE_USER } from '../../socket.io/events';
import { grey300, grey700 } from 'material-ui/styles/colors';
import {
    dialogPadding,
    sidebarMenuItemHeight
} from '../shared/styles';

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
    constructor(props) {
        super();
        this.state = {
            dialogType: props.type,
            isDialogOpen: false
        };
        this._closeDialog = this._closeDialog.bind(this);
    }

    /**
     * Changes active room when menu item is clicked.
     *
     * @param {String} roomId - The room id.
     */
    _changeRoom(roomId) {
        const {
            activeRoom,
            setUser,
            socket,
            userId
        } = this.props;

        // no-op if room has not changed
        if (activeRoom === roomId) return;

        setUser({
            rooms: { active: roomId }
        });
        socket.emit(UPDATE_USER, userId, {
            'rooms.active': roomId
        });
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

                    const style = (
                        roomId === activeRoom ?
                        activeMenuStyle :
                        menuItemStyle
                    );

                    return (
                        <MenuItem
                            onClick={() => this._changeRoom(roomId)}
                            style={style}
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
    activeRoom: React.PropTypes.string,
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
