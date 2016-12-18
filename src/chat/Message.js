'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';

/**
 * Message component.
 */
export default function Message(props) {
    return (
        <List>
            <ListItem
                disabled={true}
                leftAvatar={
                    <Avatar icon={
                        <FontIcon className='material-icons'>
                            face
                        </FontIcon>
                    } />
                }>
                {props.message}
            </ListItem>
        </List>
    );
}

Message.propTypes = {
    message: React.PropTypes.string
};
