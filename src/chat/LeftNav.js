'use strict';

/**
 * Module dependencies.
 */
import React from 'react';
import Drawer from 'material-ui/Drawer';
import { leftNavWidth } from './styles';

/**
 * LeftNav component.
 */
export default function LeftNav() {
    return (
        <Drawer open={true} width={leftNavWidth}>
        </Drawer>
    );
}
