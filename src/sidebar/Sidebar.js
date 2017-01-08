'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

// components
import Drawer from 'material-ui/Drawer';
import SidebarMenu from './SidebarMenu';
import MenuDialog from './MenuDialog';

// constants
import { leftNavWidth } from '../shared/styles';
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

    _handleMenuClick(type) {
        this.setState({
            dialogType: type,
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
            sidebar
        } = this.props;

        const {
            dialogType,
            isDialogOpen
        } = this.state;

        return (
            <Drawer open={true} width={leftNavWidth}>
                {/* channels */}
                <SidebarMenu
                    activeRoom={activeRoom}
                    onClick={this._handleMenuClick.bind(this, CHANNELS_TYPE)}
                    roomIds={sidebar[CHANNELS_TYPE]}
                    roomPrefix='# '
                    rooms={rooms}
                    title='CHANNELS'
                />

                {/* direct messages */}
                <SidebarMenu
                    activeRoom={activeRoom}
                    onClick={this._handleMenuClick.bind(this, DIRECT_MESSAGES_TYPE)}
                    roomIds={sidebar[DIRECT_MESSAGES_TYPE]}
                    rooms={rooms}
                    title='DIRECT MESSAGES'
                />

                {/* dialog */}
                {isDialogOpen && (
                    <MenuDialog
                        onRequestClose={this._handleDialogClose}
                        open={isDialogOpen}
                        title={dialogType === CHANNELS_TYPE ? 'CHANNELS' : 'DIRECT MESSAGES'}
                    />
                )}
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
