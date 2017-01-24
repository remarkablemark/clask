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

// constants
import {
    CHANNELS_TYPE,
    DIRECT_MESSAGES_TYPE
} from '../shared/constants';
import { NEW_MESSAGE } from '../../socket.io/events';

import {
    buttonWidth,
    formHeight,
    gutter,
    sidebarWidth
} from '../shared/styles';

// styles
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
        _.forEach([
            '_handleChange',
            '_handleSubmit'
        ], (methodName) => {
            this[methodName] = this[methodName].bind(this);
        });
    }

    componentDidUpdate(prevProps) {
        const { input } = this.refs;
        // when room has changed, refocus on input
        if (input && prevProps.activeRoomId !== this.props.activeRoomId) {
            input.focus();
        }
    }

    /**
     * Handles input changes.
     *
     * @param {Object} event - The event.
     * @param {String} value - The input value.
     */
    _handleChange(event, value) {
        this.setState({ value });
    }

    /**
     * Handles form submission.
     *
     * @param {Object} event - The event.
     */
    _handleSubmit(event) {
        event.preventDefault();

        // no-op if trimmed input value is empty
        const { value } = this.state;
        if (!_.trim(value)) return;

        const {
            activeRoomId,
            activeRoomUsers,
            hasMessages,
            socket,
            type,
            userId
        } = this.props;

        socket.emit(NEW_MESSAGE, {
            _room: activeRoomId,
            _user: userId,
            created: _.now(),
            isFirst: hasMessages ? undefined : true,
            text: value
        }, activeRoomUsers, type);

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

                    {/* input */}
                    <div style={inputStyle}>
                        <TextField
                            ref='input'
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
    activeRoomUsers: React.PropTypes.array,
    hasMessages: React.PropTypes.bool,
    socket: React.PropTypes.object,
    type: React.PropTypes.string,
    userId: React.PropTypes.string
};

function mapStateToProps(state) {
    const { rooms, messages, socket, user } = state;
    const activeRoomId = _.get(user, 'rooms.active');
    const activeRoom = _.get(rooms, `${activeRoomId}`, {});
    return {
        activeRoomId,
        activeRoomUsers: activeRoom._users || [],
        hasMessages: !_.isEmpty(messages[activeRoomId]),
        socket,
        type: activeRoom.name ? CHANNELS_TYPE : DIRECT_MESSAGES_TYPE,
        userId: user._id
    };
}

export default connect(
    mapStateToProps
)(Form);
