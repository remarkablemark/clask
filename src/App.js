'use strict';

/**
 * Module dependencies.
 */
require('react-tap-event-plugin')();
import React from 'react';
import { render } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const style = {
    padding: 50,
    fontSize: 14,
    fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif'
};

/**
 * Render app.
 */
render(
    <MuiThemeProvider>
        <div style={style}>
            <h1>Express-Template</h1>
            <p>Welcome to Express-Template</p>
        </div>
    </MuiThemeProvider>,
    document.getElementById('app')
);
