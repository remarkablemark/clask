'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import ListItem from 'material-ui/List/ListItem';
import { grey500 } from 'material-ui/styles/colors';

// styles
import { messagePadding } from '../shared/styles';
const styles = {
    container: {
        margin: messagePadding,
        paddingTop: messagePadding,
        paddingBottom: messagePadding
    },
    username: {
        fontWeight: 'bold',
        marginRight: 8
    },
    time: {
        fontSize: 12,
        color: grey500
    },
    text: {
        lineHeight: 1.5
    },
    avatar: {
        top: 'initial'
    }
};

/**
 * Message component.
 */
export default function Message(props) {
    const {
        created,
        id,
        text,
        username
    } = props;

    const hours = created.getHours();
    const minutes = created.getMinutes();
    const formattedTime = (
        (hours < 13 ? hours : hours - 12) + ':' +
        (minutes > 9 ? minutes : '0' + minutes) +
        (hours > 12 ? ' PM' : ' AM')
    );

    const leftAvatar = (
        <Avatar
            style={styles.avatar}
            icon={
                <FontIcon className='material-icons'>
                    face
                </FontIcon>
            }
        />
    );

    const primaryText = (
        <div>
            <strong style={styles.username}>
                {username}
            </strong>
            <span style={styles.time}>
                {formattedTime}
            </span>
            <div style={styles.text}>
                {text}
            </div>
        </div>
    );

    return (
        <div id={id}>
            <ListItem
                leftAvatar={leftAvatar}
                primaryText={primaryText}
                style={styles.container}
                disabled={true}
            />
        </div>
    );
}

Message.propTypes = {
    created: React.PropTypes.instanceOf(Date),
    id: React.PropTypes.string,
    text: React.PropTypes.string,
    username: React.PropTypes.string
};
