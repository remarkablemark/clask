'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

// styles
import { gutter } from '../shared/styles';
const style = {
    marginTop: gutter / 2
};

/**
 * RoomFinder component.
 */
export default class RoomFinder extends React.Component {
    constructor() {
        super();
        this.state = {
            searchText: ''
        };
        this._handleUpdateInput = this._handleUpdateInput.bind(this);
    }

    /**
     * Listens to input update.
     *
     * @param {String} searchText - The input value.
     */
    _handleUpdateInput(searchText) {
        this.setState({
            searchText
        });
    }

    render() {
        const {
            dataSource,
            hintText
        } = this.props;

        return (
            <AutoComplete
                dataSource={dataSource}
                hintText={hintText}
                searchText={this.state.searchText}
                onUpdateInput={this._handleUpdateInput}
                openOnFocus={true}
                fullWidth={true}
                style={style}
                autoFocus
            />
        );
    }
}

RoomFinder.propTypes = {
    dataSource: React.PropTypes.array,
    hintText: React.PropTypes.string
};

RoomFinder.defaultProps = {
    dataSource: []
};
