'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';

// components
import List from 'material-ui/List/List';
import DayDivider from './DayDivider';
import LoadMore from './LoadMore';
import Message from './Message';

// constants
import { messagesLimit } from '../../config/constants';
import { GET_MESSAGES } from '../../socket.io/events';

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
    constructor() {
        super();
        this.state = {
            isLoadingMessages: false
        };
        this._getMessages = this._getMessages.bind(this);
    }

    componentDidMount() {
        scrollIntoView(_.get(_.last(this.props.messages), '_id'));
    }

    componentDidUpdate(prevProps) {
        const { messages } = this.props;

        const messagesLenDiff = (
            messages.length - prevProps.messages.length
        );

        // new message
        if (messagesLenDiff === 1) {
            scrollIntoView(_.get(_.last(messages), '_id'));

        // multiple messages prepended
        } else if (messagesLenDiff > 1) {
            this.setState({
                isLoadingMessages: false
            });
        }
    }

    _getMessages() {
        this.setState({
            isLoadingMessages: true
        });
        this.props.socket.emit(GET_MESSAGES, {
            before: _.first(this.props.messages).created
        });
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
                <LoadMore
                    hasMore={hasMore}
                    isLoading={this.state.isLoadingMessages}
                    onClick={this._getMessages}
                />

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
    socket: React.PropTypes.object,
    users: React.PropTypes.object
};
