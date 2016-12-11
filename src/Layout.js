'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
require('react-tap-event-plugin')();

/**
 * Layout component.
 */
export default function Layout(props) {
    return (
        <MuiThemeProvider>
            {props.children}
        </MuiThemeProvider>
    );
}
