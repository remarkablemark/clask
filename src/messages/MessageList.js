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

// constants
import { messagesLimit } from '../../config/constants';
import { GET_MESSAGES } from '../../socket.io/events';
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
        this._getMessages = this._getMessages.bind(this);
        this._handleMessages = this._handleMessages.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { activeRoom, isRoomLoaded } = this.props;

        // get messages if switched to a different room
        if (!_.isUndefined(prevProps.activeRoom) &&
            activeRoom !== prevProps.activeRoom &&
            !isRoomLoaded) {
            return this._getMessages();
        }

        this._handleMessages(prevProps);
    }

    /**
     * Load messages when:
     * - room is loaded or changed
     * - 'Load More' is triggered
     */
    _getMessages() {
        // cache position
        const contentElement = this.refs.content;
        this._height = contentElement.clientHeight;
        this._top = contentElement.parentNode.scrollTop;

        this.setState({
            isLoadingMessages: true
        });

        const { activeRoom, messages, socket } = this.props;

        socket.emit(GET_MESSAGES, {
            before: _.get(messages, '[0].created', _.now()),
            roomId: activeRoom
        });
    }

    /**
     * Handles appended or prepended message(s).
     *
     * @param {Object} prevProps - The previous props.
     */
    _handleMessages(prevProps) {
        const { messages } = this.props;
        const messagesLenDiff = messages.length - prevProps.messages.length;

        // new message
        if (messagesLenDiff === 1) {
            scrollIntoView(_.get(_.last(messages), '_id'));

        // multiple messages prepended
        } else if (messagesLenDiff > 1) {
            this.setState({
                isLoadingMessages: false
            });

            // keep scroll position
            const contentElement = this.refs.content;
            contentElement.parentNode.scrollTop = (
                this._top + contentElement.clientHeight - this._height
            );
        }
    }

    _handleScroll() {
        if (!this.state.isLoadingMessages &&
            this.refs.content.parentNode.scrollTop < loadMoreTopOffset) {
            this._getMessages();
        }
    }

    render() {
        const { messages, users } = this.props;
        if (!messages || _.isEmpty(users)) return null;

        const hasMore = (
            !_.isEmpty(messages) &&
            !_.first(messages).isFirst &&
            messages.length >= messagesLimit
        );

        return (
            <List style={containerStyle} onScroll={_.debounce(this._handleScroll, 250)}>
                <div ref='content'>
                    <LoadMore
                        hasMore={hasMore}
                        isLoading={this.state.isLoadingMessages}
                        onClick={this._getMessages}
                    />

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
    activeRoom: React.PropTypes.string,
    isRoomLoaded: React.PropTypes.bool,
    messages: React.PropTypes.array,
    socket: React.PropTypes.object,
    users: React.PropTypes.object
};

MessageList.defaultProps = {
    messages: []
};

function mapStateToProps(state) {
    const { messages, socket, user, users } = state;
    const activeRoom = _.get(user, 'rooms.active');
    const activeMessages = messages[activeRoom];
    return {
        activeRoom,
        isRoomLoaded: !_.isUndefined(activeMessages),
        messages: activeMessages,
        socket,
        users
    };
}

export default connect(
    mapStateToProps
)(MessageList);
