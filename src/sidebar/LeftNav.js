'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';

// components
import Drawer from 'material-ui/Drawer';
import LeftNavMenu from './LeftNavMenu';
import MenuDialog from './MenuDialog';

// constants
import { leftNavWidth } from '../shared/styles';
import {
    CHANNELS_TYPE,
    DIRECT_MESSAGES_TYPE
} from './helpers';

/**
 * LeftNav component.
 */
export default class LeftNav extends React.Component {
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
        const { activeRoom, rooms } = this.props;
        const { dialogType, isDialogOpen } = this.state;

        return (
            <Drawer open={true} width={leftNavWidth}>
                {/* menus */}
                {_.map([CHANNELS_TYPE, DIRECT_MESSAGES_TYPE], (roomName) => {
                    const roomData = rooms[roomName];
                    const isChannel = roomName === CHANNELS_TYPE;
                    return (
                        <LeftNavMenu
                            title={isChannel ? 'CHANNELS' : 'DIRECT MESSAGES'}
                            items={roomData}
                            activeItem={activeRoom}
                            itemPrefix={isChannel ? '# ' : null}
                            onClick={this._handleMenuClick.bind(this, roomName)}
                            key={roomName}
                        />
                    );
                })}

                {isDialogOpen && (
                    <MenuDialog
                        onRequestClose={this._handleDialogClose}
                        open={isDialogOpen}
                        type={dialogType}
                    />
                )}
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
