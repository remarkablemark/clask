'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import ListItem from 'material-ui/List/ListItem';
import { grey500 } from 'material-ui/styles/colors';
import { formatTime } from './helpers';

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
                {formatTime(created)}
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
