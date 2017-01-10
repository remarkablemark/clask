'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';

// components
import Drawer from 'material-ui/Drawer';
import SidebarMenu from './SidebarMenu';
import MenuDialog from './MenuDialog';
import RoomFinder from './RoomFinder';
import CreateChannel from './CreateChannel';
import RaisedButton from 'material-ui/RaisedButton';

// constants
import {
    dialogPadding,
    sidebarWidth
} from '../shared/styles';
import {
    CHANNELS_TYPE,
    CREATE_CHANNEL_TYPE,
    DIRECT_MESSAGES_TYPE
} from './helpers';
import { defaultRoom } from '../../config/constants';

// styles
const newChannelButtonStyle = {
    position: 'absolute',
    right: dialogPadding
};

/**
 * Sidebar component.
 */
export default class Sidebar extends React.Component {
    constructor() {
        super();
        this.state = {
            isDialogOpen: false
        };
        this._handleDialogClose = this._handleDialogClose.bind(this);
    }

    /**
     * Listens to click from menu or button.
     *
     * @param {String} dialogType - The dialog type.
     */
    _handleClick(dialogType) {
        this.setState({
            dialogType,
            isDialogOpen: true
        });
    }

    _handleDialogClose() {
        this.setState({
            isDialogOpen: false
        });
    }

    render() {
        const {
            activeRoom,
            rooms,
            sidebar,
            users
        } = this.props;

        const { dialogType, isDialogOpen } = this.state;
        let dialogNode;

        if (isDialogOpen) {
            const isChannel = dialogType !== DIRECT_MESSAGES_TYPE;
            let title = !isChannel && 'DIRECT MESSAGES';
            if (dialogType === CHANNELS_TYPE) {
                title = (
                    <div>
                        CHANNELS
                        <RaisedButton
                            label='NEW CHANNEL'
                            primary={true}
                            style={newChannelButtonStyle}
                            onClick={() => this._handleClick(CREATE_CHANNEL_TYPE)}
                        />
                    </div>
                );
            } else if (dialogType === CREATE_CHANNEL_TYPE) {
                title = 'CREATE CHANNEL';
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
                    onRequestClose={this._handleDialogClose}
                    open={isDialogOpen}
                    title={title}>
                    {dialogType === CREATE_CHANNEL_TYPE ? (
                        <CreateChannel
                            onRequestClose={this._handleDialogClose}
                        />
                    ) : (
                        <RoomFinder
                            dataSource={dataSource}
                            hintText='Find or start a conversation'
                            onRequestClose={this._handleDialogClose}
                        />
                    )}
                </MenuDialog>
            );
        }

        return (
            <Drawer open={true} width={sidebarWidth}>
                {/* channels */}
                <SidebarMenu
                    activeRoom={activeRoom}
                    onClick={() => this._handleClick(CHANNELS_TYPE)}
                    roomIds={sidebar[CHANNELS_TYPE]}
                    roomPrefix='# '
                    rooms={rooms}
                    title='CHANNELS'
                />

                {/* direct messages */}
                <SidebarMenu
                    activeRoom={activeRoom}
                    onClick={() => this._handleClick(DIRECT_MESSAGES_TYPE)}
                    roomIds={sidebar[DIRECT_MESSAGES_TYPE]}
                    rooms={rooms}
                    title='DIRECT MESSAGES'
                />

                {/* dialog */}
                {dialogNode}
            </Drawer>
        );
    }
}

Sidebar.propTypes = {
    activeRoom: React.PropTypes.string,
    rooms: React.PropTypes.object,
    sidebar: React.PropTypes.shape({
        channels: React.PropTypes.array,
        directMessages: React.PropTypes.array
    }),
    users: React.PropTypes.object
};

Sidebar.defaultProps = {
    sidebar: {
        channels: [defaultRoom],
        directMessages: []
    }
};
