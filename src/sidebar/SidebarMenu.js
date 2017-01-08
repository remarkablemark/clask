'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';

// material-ui
import FontIcon from 'material-ui/FontIcon';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

// styles
import { grey300, grey700 } from 'material-ui/styles/colors';
import { leftNavMenuItemHeight } from '../shared/styles';

const menuBaseStyle = {
    minHeight: leftNavMenuItemHeight,
    lineHeight: leftNavMenuItemHeight
};

const menuHeaderStyle = _.assign({}, menuBaseStyle, {
    color: grey700,
    fontWeight: 'bold'
});

const menuItemStyle = _.assign({}, menuBaseStyle, {
    padding: '0 0.5em'
});

const activeMenuStyle = _.assign({}, menuItemStyle, {
    backgroundColor: grey300
});

// menu header icon
const rightIcon = (
    <FontIcon style={{ fontSize: 22, margin: 6 }} className='material-icons'>
        add
    </FontIcon>
);

/**
 * SidebarMenu component.
 */
export default function SidebarMenu(props) {
    const {
        activeRoom,
        onClick,
        roomIds,
        roomPrefix,
        rooms,
        title
    } = props;

    return (
        <Menu disableAutoFocus={true}>
            <MenuItem
                primaryText={title}
                rightIcon={rightIcon}
                style={menuHeaderStyle}
                onClick={onClick}
            />

            {_.map(roomIds, (roomId) => {
                const style = (
                    roomId === activeRoom ?
                    activeMenuStyle :
                    menuItemStyle
                );
                return (
                    <MenuItem style={style} key={roomId}>
                        {roomPrefix}
                        {rooms[roomId].name}
                    </MenuItem>
                );
            })}
        </Menu>
    );
}

SidebarMenu.propTypes = {
    activeRoom: React.PropTypes.string,
    onClick: React.PropTypes.func,
    roomIds: React.PropTypes.array,
    roomPrefix: React.PropTypes.node,
    rooms: React.PropTypes.object,
    title: React.PropTypes.string
};
