'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Chat from '../chat/Chat';

const style = {
    padding: 50,
    fontSize: 14,
    fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif'
};

/**
 * Index component.
 */
export default function Index() {
    return (
        <div style={style}>
            <h1>Express-Template</h1>
            <p>Welcome to Express-Template</p>
            <Chat />
        </div>
    );
}
