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

// constants
import { sidebarWidth } from '../shared/styles';
import {
    CHANNELS_TYPE,
    DIRECT_MESSAGES_TYPE
} from './helpers';
import { defaultRoom } from '../../config/constants';

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

        const { isDialogOpen } = this.state;
        let dialogNode;

        if (isDialogOpen) {
            const isChannel = this.state.dialogType === CHANNELS_TYPE;
            const title = isChannel ? 'CHANNELS' : 'DIRECT MESSAGES';
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
                    <RoomFinder
                        dataSource={dataSource}
                        hintText='Find or start a conversation'
                    />
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
