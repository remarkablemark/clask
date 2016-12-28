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
import { leftNavMenuItemHeight } from './styles';

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

// menu header icon
const rightIcon = (
    <FontIcon style={styles.menuIcon} className='material-icons'>
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
        itemPrefix
    } = props;

    return (
        <Menu disableAutoFocus={true}>
            <MenuItem
                primaryText={title}
                rightIcon={rightIcon}
                style={styles.menuHeader}
            />

            {_.map(items, (item, index) => {
                const style = (
                    item === activeItem ?
                    styles.activeMenu :
                    styles.menuItem
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
    itemPrefix: React.PropTypes.node
};
