'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import List from 'material-ui/List/List';
import Message from './Message';

// styles
import { formHeight } from '../shared/styles';
const styles = {
    container: {
        position: 'absolute',
        right: 0,
        bottom: formHeight,
        left: 0,
        paddingTop: 0,
        paddingBottom: 0,
        overflowY: 'auto',
        height: `calc(100% - ${formHeight}px)`
    }
};

/**
 * Scrolls element into view.
 *
 * @param {String} id - The element id.
 */
function scrollIntoView(id) {
    if (typeof id !== 'string') return;
    document.getElementById(id).scrollIntoView();
}

/**
 * MessageList component.
 */
export default class MessageList extends React.Component {
    componentDidUpdate() {
        const { messages } = this.props;
        // scroll to last message (if applicable)
        if (messages.length) {
            scrollIntoView(_.last(messages)._id);
        }
    }

    render() {
        const {
            messages,
            users
        } = this.props;
        return (
            <List style={styles.container}>
                {_.map(messages, (message, index) => {
                    const { _id, user_id, time, text } = message;
                    return (
                        <Message
                            id={_id}
                            user={users[user_id]}
                            text={text}
                            time={time}
                            key={index}
                        />
                    );
                })}
            </List>
        );
    }
}

MessageList.propTypes = {
    messages: React.PropTypes.array,
    users: React.PropTypes.object
};
