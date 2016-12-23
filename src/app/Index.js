'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Redirect from '../shared/Redirect';
import Chat from '../chat/Chat';

/**
 * Index component.
 */
export default function Index() {
    return (
        <Redirect unauthenticatedTo='/signin'>
            <Chat />
        </Redirect>
    );
}
