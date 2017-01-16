'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';

// components
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

// redux
import { connect } from 'react-redux';
import { setUser } from '../actions';

// constants
import { DIRECT_MESSAGES_TYPE } from '../sidebar/helpers';
import { UPDATE_USER } from '../../socket.io/events';
import { gutter } from '../shared/styles';

// styles
const autocompleteStyle = {
    marginTop: gutter / 2
};
const buttonStyle = {
    float: 'right'
};

/**
 * RoomFinder component.
 */
class RoomFinder extends React.Component {
    constructor() {
        super();
        this.state = { searchText: '' };
        this._handleUpdateInput = this._handleUpdateInput.bind(this);
        this._handleNewRequest = this._handleNewRequest.bind(this);
    }

    /**
     * Listens to input update.
     *
     * @param {String} searchText - The input value.
     */
    _handleUpdateInput(searchText) {
        this.setState({ searchText });
    }

    /**
     * Listens to when item is selected or Enter is pressed.
     *
     * @param {Object} selected       - The selected value.
     * @param {String} selected.text  - The text.
     * @param {String} selected.value - The value.
     * @param {Number} index          - The match position.
     */
    _handleNewRequest({ text, value }, index) {
        const {
            onRequestClose,
            setUser,
            socket,
            userId,
            userRooms
        } = this.props;
        const activeRoom = userRooms.active;

        // close dialog
        onRequestClose();

        // no-op if room has not changed
        if (activeRoom === value) return;

        setUser({
            rooms: { active: value }
        });

        socket.emit(UPDATE_USER, userId, {
            'rooms.active': value
        });
    }

    render() {
        const {
            dataSource,
            hintText,
            onRequestClose
        } = this.props;

        return (
            <div>
                <AutoComplete
                    dataSource={dataSource}
                    hintText={hintText}
                    searchText={this.state.searchText}
                    onNewRequest={this._handleNewRequest}
                    onUpdateInput={this._handleUpdateInput}
                    openOnFocus={true}
                    fullWidth={true}
                    style={autocompleteStyle}
                    autoFocus
                />
                <br />
                <br />

                <RaisedButton
                    label='Cancel'
                    onClick={onRequestClose}
                    style={buttonStyle}
                />
            </div>
        );
    }
}

RoomFinder.propTypes = {
    dataSource: React.PropTypes.array,
    hintText: React.PropTypes.string,
    onRequestClose: React.PropTypes.func,
    setUser: React.PropTypes.func,
    socket: React.PropTypes.object,
    userId: React.PropTypes.string,
    userRooms: React.PropTypes.object
};

RoomFinder.defaultProps = {
    dataSource: []
};

function mapStateToProps(state, ownProps) {
    const { rooms, socket, user } = state;
    const userId = user._id;
    let dataSource = [];

    // channel rooms
    if (ownProps.type !== DIRECT_MESSAGES_TYPE) {
        _.forEach(rooms, (room, id) => {
            if (room.name) {
                dataSource.push({
                    text: room.name,
                    value: id
                });
            }
        });

    // direct message rooms
    } else {
        const { users } = state;
        dataSource = _.map(users, (user, id) => {
            return {
                text: users[id].username,
                value: [userId, id]
            };
        });
    }

    return {
        dataSource,
        socket,
        userId,
        userRooms: user.rooms || {}
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setUser: (user) => {
            return dispatch(setUser(user));
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoomFinder);
