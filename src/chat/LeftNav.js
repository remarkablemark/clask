'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { leftNavWidth } from './styles';
import {
    CONNECTED_USERS,
    DISCONNECTED_USER
} from '../../socket.io/events';

// styles
import { grey300, grey700 } from 'material-ui/styles/colors';
import { leftNavMenuItemHeight } from './styles';

const styles = {};
styles.menuBase = {
    minHeight: leftNavMenuItemHeight,
    lineHeight: leftNavMenuItemHeight
};
styles.menuHeader = Object.assign({}, styles.menuBase, {
    color: grey700,
    fontWeight: 'bold'
});
styles.menuItem = Object.assign({}, styles.menuBase, {
    padding: '0 0.5em'
});
styles.activeMenu = Object.assign({}, styles.menuItem, {
    backgroundColor: grey300
});

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
                {/* channels */}
                <Menu disableAutoFocus={true}>
                    <MenuItem style={styles.menuHeader}>
                        CHANNELS
                    </MenuItem>
                    {_.map(rooms.channels, (channel) => {
                        const style = (
                            channel === activeRoom ?
                            styles.activeMenu :
                            styles.menuItem
                        );
                        return (
                            <MenuItem style={style} key={channel}>
                                {'# ' + channel}
                            </MenuItem>
                        );
                    })}
                </Menu>

                {/* direct messages */}
                <Menu disableAutoFocus={true}>
                    <MenuItem style={styles.menuHeader}>
                        DIRECT MESSAGES
                    </MenuItem>
                    {_.map(rooms.directMessages, (directMessage, index) => {
                        const style = (
                            directMessage === activeRoom ?
                            styles.activeMenu :
                            styles.menuItem
                        );
                        return (
                            <MenuItem style={style} key={index}>
                                {directMessage}
                            </MenuItem>
                        );
                    })}
                </Menu>
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
    activeRoom: 'general',
    rooms: {
        channels: ['general'],
        directMessages: []
    }
};
