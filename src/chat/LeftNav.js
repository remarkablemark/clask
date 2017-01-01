'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import LeftNavMenu from './LeftNavMenu';

// material-ui
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';

// styles
import { leftNavWidth } from '../shared/styles';

/**
 * LeftNav component.
 */
export default class LeftNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDialogOpen: false
        };
        this._handleDialogClose = this._handleDialogClose.bind(this);
    }

    _handleMenuClick(menuIndex) {
        switch (menuIndex) {
            case 'channels':
                this.setState({
                    isDialogOpen: true,
                    dialogTitle: 'Channels'
                });
                break;

            case 'directMessages':
                this.setState({
                    isDialogOpen: true,
                    dialogTitle: 'Direct Messages'
                });
                break;
        }
    }

    _handleDialogClose() {
        this.setState({
            isDialogOpen: false
        });
    }

    render() {
        const { activeRoom, rooms } = this.props;
        const { dialogTitle, isDialogOpen } = this.state;

        return (
            <Drawer open={true} width={leftNavWidth}>
                {/* menus */}
                {_.map(['channels', 'directMessages'], roomName => {
                    const roomData = rooms[roomName];
                    const isChannel = roomName === 'channels';
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

                {/* dialog */}
                <Dialog
                    title={dialogTitle}
                    open={isDialogOpen}
                    onRequestClose={this._handleDialogClose}
                />
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
