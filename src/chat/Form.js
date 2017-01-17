'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';

// material-ui
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

// redux
import { connect } from 'react-redux';

// socket
import { NEW_MESSAGE } from '../../socket.io/events';

// styles
import {
    buttonWidth,
    formHeight,
    gutter,
    sidebarWidth
} from '../shared/styles';

const formStyle = {
    position: 'fixed',
    right: 0,
    bottom: 0,
    left: 0,
    marginLeft: sidebarWidth,
    height: formHeight
};

const lineStyle = {
    marginBottom: gutter
};

const containerStyle = {
    position: 'relative',
    margin: `0 ${gutter}px`
};

const buttonStyle = {
    // width is 48px
    position: 'absolute',
    left: 0
};

const inputStyle = {
    position: 'absolute',
    right: 0,
    left: buttonWidth
};

/**
 * Form component.
 */
class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            value: ''
        };
        this._handleChange = this._handleChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    _handleSubmit(event) {
        event.preventDefault();

        // no-op if trimmed input value is empty
        const { value } = this.state;
        if (!_.trim(value)) return;

        const {
            activeRoomId,
            hasMessages,
            socket,
            userId
        } = this.props;

        socket.emit(NEW_MESSAGE, {
            _room: activeRoomId,
            _user: userId,
            created: _.now(),
            isFirst: hasMessages ? undefined : true,
            text: value
        });

        // reset input
        this.setState({ value: '' });
    }

    render() {
        const { activeRoomId, userId }  = this.props;
        if (!activeRoomId || !userId) return null;

        return (
            <form onSubmit={this._handleSubmit} style={formStyle}>
                <Divider style={lineStyle} />
                <div style={containerStyle}>
                    <div style={buttonStyle}>
                        <IconButton
                            iconClassName='material-icons'
                            type='submit'>
                            add
                        </IconButton>
                    </div>
                    <div style={inputStyle}>
                        <TextField
                            autoComplete='off'
                            autoCorrect='off'
                            fullWidth={true}
                            hintText='Message'
                            onChange={this._handleChange}
                            spellCheck='true'
                            value={this.state.value}
                            autoFocus
                        />
                    </div>
                </div>
            </form>
        );
    }
}

Form.propTypes = {
    activeRoomId: React.PropTypes.string,
    hasMessages: React.PropTypes.bool,
    socket: React.PropTypes.object,
    userId: React.PropTypes.string
};

function mapStateToProps(state) {
    const { messages, socket, user } = state;
    const userRooms = _.get(user, 'rooms', {});
    const activeRoomId = userRooms.active;

    return {
        activeRoomId,
        hasMessages: _.get(messages, activeRoomId, []).length !== 0,
        socket: socket,
        userId: user._id
    };
}

export default connect(
    mapStateToProps
)(Form);
