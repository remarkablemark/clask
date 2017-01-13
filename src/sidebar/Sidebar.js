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
import { setUser } from '../actions';

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
        setUser,
        sidebar,
        socket,
        users,
        userId
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
                setUser={setUser}
                socket={socket}
                title='CHANNELS'
                type={CHANNELS_TYPE}
                users={users}
                userId={userId}
            />

            {/* direct messages */}
            <SidebarMenu
                activeRoom={activeRoom}
                roomIds={sidebar[DIRECT_MESSAGES_TYPE]}
                rooms={rooms}
                setUser={setUser}
                socket={socket}
                title='DIRECT MESSAGES'
                type={DIRECT_MESSAGES_TYPE}
                users={users}
                userId={userId}
            />
        </Drawer>
    );
}

Sidebar.propTypes = {
    activeRoom: React.PropTypes.string,
    rooms: React.PropTypes.object,
    setUser: React.PropTypes.func,
    sidebar: React.PropTypes.shape({
        channels: React.PropTypes.array,
        directMessages: React.PropTypes.array
    }),
    socket: React.PropTypes.object,
    users: React.PropTypes.object,
    userId: React.PropTypes.string
};

Sidebar.defaultProps = {
    sidebar: {
        channels: [defaultRoom],
        directMessages: []
    }
};

function mapStateToProps(state) {
    const { rooms, socket, user, users } = state;
    const activeRoom = _.get(user, 'rooms.active');
    const sidebar = _.get(user, 'rooms.sidebar');
    return {
        activeRoom,
        rooms,
        sidebar,
        socket,
        users,
        userId: user._id
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setUser: (user) => {
            dispatch(setUser(user));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);
