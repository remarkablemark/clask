'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import ListItem from 'material-ui/List/ListItem';

/**
 * Message component.
 */
export default function Message(props) {
    const { message } = props;
    return (
        <ListItem
            primaryText={message}
            leftAvatar={
                <Avatar icon={
                    <FontIcon className='material-icons'>
                        face
                    </FontIcon>
                } />
            }
            disabled={true}
        />
    );
}

Message.propTypes = {
    message: React.PropTypes.string
};
