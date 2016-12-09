'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

const style = {
    padding: 50,
    fontSize: 14,
    fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif'
};

/**
 * App component.
 */
class App extends React.Component {
    render() {
        return (
            <div style={style}>
                <h1>Express</h1>
                <p>Welcome to Express</p>
            </div>
        );
    }
}

export default App;
