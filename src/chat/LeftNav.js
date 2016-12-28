'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';

// material-ui
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

// socket
import {
    CONNECTED_USERS,
    DISCONNECTED_USER
} from '../../socket.io/events';

// styles
import { grey300, grey700 } from 'material-ui/styles/colors';
import {
    leftNavWidth,
    leftNavMenuItemHeight
} from './styles';

const styles = {
    menuBase: {
        minHeight: leftNavMenuItemHeight,
        lineHeight: leftNavMenuItemHeight
    },
    menuIcon: {
        fontSize: 22,
        margin: 6
    }
};
styles.menuHeader = _.assign({}, styles.menuBase, {
    color: grey700,
    fontWeight: 'bold'
});
styles.menuItem = _.assign({}, styles.menuBase, {
    padding: '0 0.5em'
});
styles.activeMenu = _.assign({}, styles.menuItem, {
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
        const rightIcon = (
            <FontIcon style={styles.menuIcon} className='material-icons'>
                add
            </FontIcon>
        );

        return (
            <Drawer open={true} width={leftNavWidth}>
                {/* channels */}
                <Menu disableAutoFocus={true}>
                    <MenuItem
                        primaryText='CHANNELS'
                        rightIcon={rightIcon}
                        style={styles.menuHeader}
                    />

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
                    <MenuItem
                        primaryText='DIRECT MESSAGES'
                        rightIcon={rightIcon}
                        style={styles.menuHeader}
                    />

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
    rooms: {
        channels: ['general'],
        directMessages: []
    }
};
