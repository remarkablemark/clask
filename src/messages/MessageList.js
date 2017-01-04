'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import List from 'material-ui/List/List';
import DayDivider from './DayDivider';
import LoadMore from './LoadMore';
import Message from './Message';
import { messagesLimit } from '../../config/constants';

// styles
import { formHeight } from '../shared/styles';
const containerStyle = {
    position: 'absolute',
    right: 0,
    bottom: formHeight,
    left: 0,
    paddingTop: 0,
    paddingBottom: 0,
    overflowY: 'auto',
    height: `calc(100% - ${formHeight}px)`
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

        const hasMore = (
            !_.first(messages).isFirst &&
            messages.length >= messagesLimit
        );

        return (
            <List style={containerStyle}>
                <LoadMore hasMore={hasMore} />

                {_.map(messages, (message) => {
                    const {
                        _id,
                        created,
                        isNewDay,
                        text,
                        user_id
                    } = message;

                    const messageNode = (
                        <Message
                            created={created}
                            id={_id}
                            key={_id}
                            text={text}
                            username={users[user_id].username}
                        />
                    );

                    if (!isNewDay) return messageNode;
                    return [
                        <DayDivider date={created} />,
                        messageNode
                    ];
                })}
            </List>
        );
    }
}

MessageList.propTypes = {
    messages: React.PropTypes.array,
    users: React.PropTypes.object
};
