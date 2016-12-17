'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

// constants
const buttonWidth = 48;

// styles
const styles = {
    container: {
        position: 'fixed',
        right: 0,
        bottom: 0,
        left: 0,
        margin: '0 auto',
        width: '100%',
        height: buttonWidth * 2
    },
    line: {
        marginBottom: buttonWidth / 2
    },
    button: {
        position: 'absolute',
        left: 0,
        width: buttonWidth
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
    constructor(props) {
        super(props);
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
        window.requirejs(['socket'], (socket) => {
            socket.emit('chat:message', this.state.value);
            this.setState({
                value: ''
            });
        });
    }

    render() {
        return (
            <form onSubmit={this._handleSubmit} style={styles.container}>
                <Divider style={styles.line} />
                <div style={styles.button}>
                    <IconButton iconClassName='material-icons' type='submit'>
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
                    />
                </div>
            </form>
        );
    }
}
