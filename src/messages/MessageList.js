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

// redux
import { connect } from 'react-redux';
import { setUser } from '../actions';

// constants
import {
    GET_MESSAGES,
    UPDATE_USER
} from '../../socket.io/events';
import { formHeight, gutter } from '../shared/styles';
const loadMoreTopOffset = gutter * 3;

// styles
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
class MessageList extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoadingMessages: false
        };
        _.forEach([
            '_getMessages',
            '_handleMessages',
            '_handleMentions',
            '_handleScroll'
        ], (methodName) => {
            this[methodName] = this[methodName].bind(this);
        });
    }

    componentDidUpdate(prevProps) {
        const {
            activeRoomId,
            hasMentions,
            isRoomLoaded
        } = this.props;

        if (isRoomLoaded) {
            this._handleMessages(prevProps);
            if (hasMentions) this._handleMentions();
        } else if (activeRoomId) this._getMessages();
    }

    /**
     * Load messages when:
     * - room is loaded or changed
     * - 'Load More' is triggered
     */
    _getMessages() {
        const {
            activeMessageId,
            activeRoomId,
            isRoomLoaded,
            messages,
            socket
        } = this.props;

        if (isRoomLoaded) {
            // cache scroll position
            const contentElement = this.refs.content;
            this._height = contentElement.clientHeight;
            this._top = contentElement.parentNode.scrollTop;

            this.setState({
                isLoadingMessages: true
            });
        }

        socket.emit(GET_MESSAGES, {
            before: _.get(messages, '[0].created', _.now()),
            messageId: isRoomLoaded ? undefined : activeMessageId,
            roomId: activeRoomId
        });
    }

    /**
     * Handles appended or prepended message(s).
     *
     * @param {Object} prevProps - The previous props.
     */
    _handleMessages(prevProps) {
        const {
            activeMessageId,
            activeRoomId,
            messages,
            setUser,
            socket,
            userId
        } = this.props;

        const prevMessagesLen = prevProps.messages.length;
        const messagesLenDiff = messages.length - prevMessagesLen;

        // scroll to last message in user history if room has changed
        if (prevProps.activeRoomId && activeRoomId &&
            prevProps.activeRoomId !== activeRoomId) {
            return scrollIntoView(activeMessageId);
        }

        // single (new) message
        if (messagesLenDiff === 1) {
            const lastMessageId = _.get(_.last(messages), '_id');
            // set active message id
            if (lastMessageId !== activeMessageId) {
                setUser({
                    rooms: {
                        history: {
                            [activeRoomId]: {
                                _message: lastMessageId
                            }
                        }
                    }
                });
                socket.emit(UPDATE_USER, userId, {
                    [`rooms.history.${activeRoomId}._message`]: lastMessageId
                });
            }
            // scroll to last message
            scrollIntoView(lastMessageId);

        // multiple messages
        } else if (messagesLenDiff > 1) {
            if (this.state.isLoadingMessages) {
                this.setState({
                    isLoadingMessages: false
                });
            }

            // appended (room loaded or changed)
            if (!prevMessagesLen) {
                // scroll to last message in user history
                scrollIntoView(activeMessageId);

            // prepended
            } else {
                // maintain scroll position
                const contentElement = this.refs.content;
                contentElement.parentNode.scrollTop = (
                    this._top + contentElement.clientHeight - this._height
                );
            }
        }
    }

    _handleMentions() {
        const {
            activeRoomId,
            setUser,
            socket,
            userId
        } = this.props;

        // reset mentions
        setUser({
            rooms: {
                history: {
                    [activeRoomId]: {
                        mentions: 0
                    }
                }
            }
        });
        socket.emit(UPDATE_USER, userId, {
            [`rooms.history.${activeRoomId}.mentions`]: 0
        });
    }

    _handleScroll() {
        // get messages if load more is reached
        if (!this.state.isLoadingMessages &&
            this.refs.content.parentNode.scrollTop < loadMoreTopOffset) {
            this._getMessages();
        }
    }

    render() {
        const { messages, users } = this.props;
        if (!messages || _.isEmpty(users)) return null;

        return (
            <List style={containerStyle} onScroll={_.debounce(this._handleScroll, 250)}>
                <div ref='content'>
                    {!_.isEmpty(messages) && (
                        <LoadMore
                            hasMore={!_.get(messages, '[0].isFirst')}
                            isLoading={this.state.isLoadingMessages}
                            onClick={this._getMessages}
                        />
                    )}

                    {_.map(messages, (message) => {
                        const {
                            _id,
                            _user,
                            created,
                            isNewDay,
                            text
                        } = message;

                        const messageNode = (
                            <Message
                                created={created}
                                id={_id}
                                key={_id}
                                text={text}
                                username={users[_user].username}
                            />
                        );

                        if (!isNewDay) return messageNode;
                        return [
                            <DayDivider date={created} />,
                            messageNode
                        ];
                    })}
                </div>
            </List>
        );
    }
}

MessageList.propTypes = {
    activeRoomId: React.PropTypes.string,
    activeMessageId: React.PropTypes.string,
    isRoomLoaded: React.PropTypes.bool,
    hasMentions: React.PropTypes.bool,
    messages: React.PropTypes.array,
    setUser: React.PropTypes.func,
    socket: React.PropTypes.object,
    userId: React.PropTypes.string,
    users: React.PropTypes.object
};

MessageList.defaultProps = {
    messages: []
};

function mapStateToProps(state) {
    const { messages, socket, user, users } = state;
    const userRooms = _.get(user, 'rooms', {});
    const activeRoomId = userRooms.active;
    const activeMessages = messages[activeRoomId];
    const activeRoomHistory = _.get(userRooms, `history.${activeRoomId}`, {});
    return {
        activeRoomId,
        activeMessageId: activeRoomHistory._message,
        isRoomLoaded: user.isAuthenticated && _.isArray(activeMessages),
        hasMentions: activeRoomHistory.mentions > 0,
        messages: activeMessages,
        socket,
        userId: user._id,
        users
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setUser: (user) => {
            dispatch(setUser(user));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageList);
