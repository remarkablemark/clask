'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Redirect from '../shared/Redirect';
import Socket from '../socket/Socket';

/**
 * Index component.
 */
export default function Index() {
    return (
        <Redirect unauthenticatedTo='/signin'>
            <Socket />
        </Redirect>
    );
}
