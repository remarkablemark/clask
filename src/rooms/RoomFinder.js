'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

// styles
import { gutter } from '../shared/styles';
const autocompleteStyle = {
    marginTop: gutter / 2
};
const buttonStyle = {
    float: 'right'
};

/**
 * RoomFinder component.
 */
export default class RoomFinder extends React.Component {
    constructor() {
        super();
        this.state = { searchText: '' };
        this._handleUpdateInput = this._handleUpdateInput.bind(this);
    }

    /**
     * Listens to input update.
     *
     * @param {String} searchText - The input value.
     */
    _handleUpdateInput(searchText) {
        this.setState({ searchText });
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
    onRequestClose: React.PropTypes.func
};

RoomFinder.defaultProps = {
    dataSource: []
};
