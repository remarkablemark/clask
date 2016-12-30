'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

// components
import LeftNav from './LeftNav';
import MessageList from './MessageList';
import Form from './Form';

// redux
import { connect } from 'react-redux';

// styles
import { leftNavWidth } from './styles';
const styles = {
    container: {
        height: '100%'
    },
    content: {
        position: 'relative',
        marginLeft: leftNavWidth,
        height: '100%'
    }
};

/**
 * Chat component.
 */
class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            messages: props.messages
        };
    }

    componentDidMount() {
        const { activeRoom } = this.props;
        window.requirejs(['superagent'], (request) => {
            request.get('/api/messages/' + activeRoom, (error, response) => {
                if (error || !response.ok) {
                    return console.log(error, response); // eslint-disable-line no-console
                }
                this.setState({
                    messages: response.body,
                    isLoaded: true
                });
            });
        });
    }

    render() {
        const {
            isLoaded,
            messages
        } = this.state;
        const {
            activeRoom,
            users
        } = this.props;
        if (!isLoaded) return null;

        return (
            <div style={styles.container}>
                <LeftNav
                    activeRoom={activeRoom}
                    users={users}
                />
                <div style={styles.content}>
                    <MessageList messages={messages} users={users} />
                    <Form activeRoom={activeRoom} />
                </div>
            </div>
        );
    }
}

Chat.propTypes = {
    activeRoom: React.PropTypes.string,
    messages: React.PropTypes.array,
    users: React.PropTypes.object
};

Chat.defaultProps = {
    activeRoom: 'general',
    messages: [],
    users: {}
};

function mapStateToProps(state) {
    return {
        users: state.users
    };
}

export default connect(
    mapStateToProps,
    null
)(Chat);
