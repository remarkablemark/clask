'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import LeftNavMenu from './LeftNavMenu';

// material-ui
import Drawer from 'material-ui/Drawer';

// styles
import { leftNavWidth } from './styles';

// socket
import {
    CONNECTED_USERS,
    DISCONNECTED_USER
} from '../../socket.io/events';

/**
 * LeftNav component.
 */
export default class LeftNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        window.requirejs(['socket'], (socket) => {
            // an array of user id(s)
            socket.on(CONNECTED_USERS, (users) => {
                this.setState({
                    users: _.concat(this.state.users, users)
                });
            });

            // remove user id
            socket.on(DISCONNECTED_USER, (userId) => {
                const copy = this.state.users.slice();
                const index = copy.indexOf(userId);
                if (index !== -1) {
                    copy.splice(index, 1);
                    this.setState({
                        users: copy
                    });
                }
            });
        });
    }

    render() {
        const { activeRoom, rooms } = this.props;
        return (
            <Drawer open={true} width={leftNavWidth}>
                {/* menus */}
                {_.map(rooms, (roomData, roomName) => {
                    const isChannel = roomName === 'channels';
                    return (
                        <LeftNavMenu
                            title={isChannel ? 'CHANNELS' : 'DIRECT MESSAGES'}
                            items={roomData}
                            activeItem={activeRoom}
                            itemPrefix={isChannel ? '# ' : null}
                            key={roomName}
                        />
                    );
                })}
            </Drawer>
        );
    }
}

LeftNav.propTypes = {
    activeRoom: React.PropTypes.string,
    rooms: React.PropTypes.shape({
        channels: React.PropTypes.array,
        directMessages: React.PropTypes.array
    }),
    users: React.PropTypes.object
};

LeftNav.defaultProps = {
    rooms: {
        channels: ['general'],
        directMessages: []
    }
};
