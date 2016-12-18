'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

// styles
import { buttonWidth, formHeight, gutter } from './styles';
const styles = {
    form: {
        position: 'fixed',
        right: 0,
        bottom: 0,
        left: 0,
        margin: '0 auto',
        width: '100%',
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
                        />
                    </div>
                </div>
            </form>
        );
    }
}
