'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

// components
import Drawer from 'material-ui/Drawer';
import SidebarMenu from './SidebarMenu';

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
export default function Sidebar(props) {
    const {
        activeRoom,
        rooms,
        sidebar,
        users
    } = props;

    return (
        <Drawer open={true} width={sidebarWidth}>
            {/* channels */}
            <SidebarMenu
                activeRoom={activeRoom}
                roomIds={sidebar[CHANNELS_TYPE]}
                roomPrefix='# '
                rooms={rooms}
                title='CHANNELS'
                type={CHANNELS_TYPE}
                users={users}
            />

            {/* direct messages */}
            <SidebarMenu
                activeRoom={activeRoom}
                roomIds={sidebar[DIRECT_MESSAGES_TYPE]}
                rooms={rooms}
                title='DIRECT MESSAGES'
                type={DIRECT_MESSAGES_TYPE}
                users={users}
            />
        </Drawer>
    );
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
