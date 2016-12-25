'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import { browserHistory } from 'react-router';
import List from 'material-ui/List/List';
import Message from './Message';

// redux
import { connect } from 'react-redux';
import { removeUser } from '../user/actions';

// socket
import {
    CHAT_MESSAGE,
    USER_AUTH
} from '../../socket.io/events';

// styles
import { formHeight, gutter } from './styles';
const styles = {
    container: {
        position: 'absolute',
        right: 0,
        bottom: formHeight,
        left: 0,
        margin: gutter,
        overflowY: 'auto'
    }
};

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
        window.requirejs(['socket'], (socket) => {
            socket.on(CHAT_MESSAGE, (message) => {
                this.setState({
                    messages: this.state.messages.concat([message])
                });
            });

            socket.on(USER_AUTH, (isAuthenticated) => {
                if (!isAuthenticated) {
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
            <div>
                <List style={styles.container}>
                    {messages.map((message, index) => {
                        const { user_id, time, text } = message;
                        return (
                            <Message
                                user={users[user_id]}
                                text={text}
                                time={time}
                                key={index}
                            />
                        );
                    })}
                </List>
            </div>
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
