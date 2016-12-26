'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import List from 'material-ui/List/List';
import Message from './Message';

// redux
import { connect } from 'react-redux';
import { removeUser } from '../user/actions';

// socket
import {
    CHAT_MESSAGE,
    USER_DATA
} from '../../socket.io/events';

// styles
import { formHeight } from './styles';
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
class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages
        };
    }

    componentDidMount() {
        const { messages } = this.state;

        // scroll to last message (if applicable)
        if (messages.length) {
            scrollIntoView(_.last(messages)._id);
        }

        window.requirejs(['socket'], (socket) => {
            socket.on(CHAT_MESSAGE, (message) => {
                this.setState({
                    messages: _.concat(this.state.messages, [message])
                }, () => {
                    scrollIntoView(message._id);
                });
            });

            socket.on(USER_DATA, (user) => {
                if (!user.isAuthenticated) {
                    this.props._removeUser();
                    socket.disconnect();
                    browserHistory.push('/signin');
                }
            });
        });
    }

    render() {
        const { users } = this.props;
        const { messages } = this.state;
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
    users: React.PropTypes.object,
    _removeUser: React.PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        _removeUser: (user) => {
            dispatch(removeUser(user));
        }
    };
}

export default connect(
    null,
    mapDispatchToProps
)(MessageList);
