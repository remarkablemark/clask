'use strict';

/**
 * Module dependencies.
 */
import React from 'react';

// components
import Sidebar from '../sidebar/Sidebar';
import MessageList from '../messages/MessageList';
import Form from './Form';

// styles
import { sidebarWidth } from '../shared/styles';
const styles = {
    container: {
        height: '100%'
    },
    content: {
        position: 'relative',
        marginLeft: sidebarWidth,
        height: '100%'
    }
};

/**
 * Chat component.
 */
export default function Chat(props) {
    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.content}>
                <MessageList />
                <Form />
            </div>
        </div>
    );
}
