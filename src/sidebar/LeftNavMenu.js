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
 * LeftNavMenu component.
 */
export default function LeftNavMenu(props) {
    const {
        title,
        items,
        activeItem,
        itemPrefix,
        onClick
    } = props;

    return (
        <Menu disableAutoFocus={true}>
            <MenuItem
                primaryText={title}
                rightIcon={rightIcon}
                style={menuHeaderStyle}
                onClick={onClick}
            />

            {_.map(items, (item, index) => {
                const style = (
                    item === activeItem ?
                    activeMenuStyle :
                    menuItemStyle
                );
                return (
                    <MenuItem style={style} key={index}>
                        {itemPrefix}
                        {item}
                    </MenuItem>
                );
            })}
        </Menu>
    );
}

LeftNavMenu.propTypes = {
    title: React.PropTypes.string,
    items: React.PropTypes.array,
    activeItem: React.PropTypes.string,
    itemPrefix: React.PropTypes.node,
    onClick: React.PropTypes.func
};
