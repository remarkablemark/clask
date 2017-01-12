'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

// redux
import { connect } from 'react-redux';

// constants
import { NEW_ROOM } from '../../socket.io/events';

// styles
import { gutter } from '../shared/styles';
const buttonStyle = {
    float: 'right'
};
const lastButtonStyle = _.assign({
    marginLeft: gutter / 2
}, buttonStyle);

/**
 * CreateChannel component.
 */
class CreateChannel extends React.Component {
    constructor() {
        super();
        this.state = {
            errorText: '',
            isPublic: false,
            name: ''
        };
        // bind internal methods
        _.forEach([
            '_handleChange',
            '_handleSubmit',
            '_handleToggle'
        ], (methodName) => {
            this[methodName] = this[methodName].bind(this);
        });
    }

    componentDidMount() {
        const { onRequestClose, socket } = this.props;
        socket.on(NEW_ROOM, ({ success, message }) => {
            if (success) {
                onRequestClose();
            } else {
                this.setState({
                    errorText: message
                });
            }
        });
    }

    componentWillUnmount() {
        this.props.socket.off(NEW_ROOM);
    }

    /**
     * Registers and validates input changes.
     *
     * @param {Object} event - The event.
     * @param {String} name  - The input value.
     */
    _handleChange(event, name) {
        let errorText;
        if (!_.trim(name)) {
            errorText = 'Name must not be blank.';
        } else if (!/^\w+$/.test(name)) {
            errorText = 'Name must be alphanumeric.';
        } else if (this.props.rooms.indexOf(name) !== -1) {
            errorText = 'Name is already taken.';
        }
        this.setState({
            errorText,
            name
        });
    }

    /**
     * Toggles `isPublic`.
     *
     * @param {Object} event    - The event.
     * @param {String} isPublic - The toggle value.
     */
    _handleToggle(event, isPublic) {
        this.setState({ isPublic });
    }

    /**
     * Create channel on form submission.
     *
     * @param {Object} event - The event.
     */
    _handleSubmit(event) {
        event.preventDefault();
        const { socket, userId } = this.props;
        const { errorText, name, isPublic } = this.state;

        // validation must pass
        if (errorText) return;

        socket.emit(NEW_ROOM, {
            name,
            isPublic,
            _creator: userId
        });
    }

    render() {
        const {
            errorText,
            isPublic,
            name
        } = this.state;

        return (
            <form onSubmit={this._handleSubmit}>
                <TextField
                    floatingLabelText='Channel Name'
                    value={name}
                    errorText={errorText}
                    fullWidth={true}
                    onChange={this._handleChange}
                    autoFocus
                />
                <br />
                <br />

                <Toggle
                    label='Public (anyone can join)'
                    labelPosition='right'
                    onToggle={this._handleToggle}
                    toggled={isPublic}
                />
                <br />
                <br />

                <RaisedButton
                    label='Create Channel'
                    type='submit'
                    primary={true}
                    style={lastButtonStyle}
                />
                <RaisedButton
                    label='Cancel'
                    onClick={this.props.onRequestClose}
                    style={buttonStyle}
                />
            </form>
        );
    }
}

CreateChannel.propTypes = {
    onRequestClose: React.PropTypes.func,
    rooms: React.PropTypes.array,
    socket: React.PropTypes.object,
    userId: React.PropTypes.string
};

function mapStateToProps(state) {
    return {
        rooms: _.map(state.rooms, (value, key) => {
            return value.name;
        }),
        socket: state.socket,
        userId: state.user._id
    };
}

export default connect(
    mapStateToProps
)(CreateChannel);
