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
import { messagePadding } from './styles';
const styles = {
    listItemInnerDiv: {
        paddingTop: messagePadding,
        paddingBottom: messagePadding
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
    const { text, time } = props;
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = (
        (hours < 13 ? hours : hours - 12) + ':' +
        (minutes > 9 ? minutes : '0' + minutes) +
        (hours > 12 ? ' PM' : ' AM')
    );

    return (
        <ListItem
            primaryText={
                <div>
                    <span style={styles.time}>{formattedTime}</span>
                    <div style={styles.text}>{text}</div>
                </div>
            }
            leftAvatar={
                <Avatar
                    style={styles.avatar}
                    icon={
                        <FontIcon className='material-icons'>
                            face
                        </FontIcon>
                    }
                />
            }
            innerDivStyle={styles.listItemInnerDiv}
            disabled={true}
        />
    );
}

Message.propTypes = {
    text: React.PropTypes.string,
    time: React.PropTypes.number
};
