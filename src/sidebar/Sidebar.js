'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';

// components
import Drawer from 'material-ui/Drawer';
import SidebarMenu from './SidebarMenu';

// redux
import { connect } from 'react-redux';

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
function Sidebar(props) {
    const {
        activeRoom,
        rooms,
        sidebar,
        users
    } = props;

    if (!activeRoom || _.isEmpty(rooms) || _.isEmpty(users)) return null;

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

function mapStateToProps(state) {
    const { rooms, user, users } = state;
    const activeRoom = _.get(user, 'rooms.active');
    const sidebar = _.get(user, 'rooms.sidebar');

    return {
        activeRoom,
        rooms,
        sidebar,
        users
    };
}

export default connect(
    mapStateToProps
)(Sidebar);
