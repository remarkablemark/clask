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
import { grey700 } from 'material-ui/styles/colors';
import { leftNavMenuItemHeight } from './styles';

const styles = {};
styles.menu = {
    minHeight: leftNavMenuItemHeight,
    lineHeight: leftNavMenuItemHeight
};
styles.header = Object.assign({}, styles.menu, {
    color: grey700,
    fontWeight: 'bold'
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
        const { users } = this.props;
        return (
            <Drawer open={true} width={leftNavWidth}>
                {/* channels */}
                <Menu disableAutoFocus={true}>
                    <MenuItem style={styles.header}>
                        CHANNELS
                    </MenuItem>
                    {_.map(this.state.channels, (channel) => {
                        return (
                            <MenuItem style={styles.menu} key={channel}>
                                {channel}
                            </MenuItem>
                        );
                    })}
                </Menu>

                {/* direct messages */}
                <Menu disableAutoFocus={true}>
                    <MenuItem style={styles.header}>
                        DIRECT MESSAGES
                    </MenuItem>
                    {_.map(_.uniq(this.state.users), (userId) => {
                        return (
                            <MenuItem style={styles.menu} key={userId}>
                                {users[userId].username}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Drawer>
        );
    }
}

LeftNav.propTypes = {
    users: React.PropTypes.object,
    channels: React.PropTypes.array
};
