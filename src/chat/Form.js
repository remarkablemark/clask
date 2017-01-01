'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import _ from 'lodash';
import { getTime } from './helpers';

// material-ui
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

// socket
import { MESSAGE } from '../../socket.io/events';

// styles
import {
    buttonWidth,
    formHeight,
    gutter,
    leftNavWidth
} from '../shared/styles';

const styles = {
    form: {
        position: 'fixed',
        right: 0,
        bottom: 0,
        left: 0,
        marginLeft: leftNavWidth,
        height: formHeight
    },
    line: {
        marginBottom: gutter
    },
    container: {
        position: 'relative',
        margin: `0 ${gutter}px`
    },
    button: {
        // width is 48px
        position: 'absolute',
        left: 0
    },
    input: {
        position: 'absolute',
        right: 0,
        left: buttonWidth
    }
};

/**
 * Form component.
 */
export default class Form extends React.Component {
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

        this.props.socket.emit(MESSAGE, {
            text: value,
            time: getTime(),
            user_id: this.props.userId,
            room_id: this.props.activeRoom
        });
        this.setState({ value: '' });
    }

    render() {
        return (
            <form onSubmit={this._handleSubmit} style={styles.form}>
                <Divider style={styles.line} />
                <div style={styles.container}>
                    <div style={styles.button}>
                        <IconButton
                            iconClassName='material-icons'
                            type='submit'>
                            add
                        </IconButton>
                    </div>
                    <div style={styles.input}>
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
    activeRoom: React.PropTypes.string,
    socket: React.PropTypes.object,
    userId: React.PropTypes.string
};
