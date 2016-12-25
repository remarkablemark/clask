'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { leftNavWidth } from './styles';
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
        const { users } = this.props;
        return (
            <Drawer open={true} width={leftNavWidth}>
                {_.map(_.uniq(this.state.users), (userId, index) => {
                    return (
                        <MenuItem key={index}>
                            {users[userId].username}
                        </MenuItem>
                    );
                })}
            </Drawer>
        );
    }
}

LeftNav.propTypes = {
    users: React.PropTypes.object
};
