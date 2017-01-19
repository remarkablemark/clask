'use strict';

/**
 * Module dependencies.
 */
import { UPDATE_USER } from '../../socket.io/events';

/**
 * Changes the active room.
 *
 * @param {String} roomId - The room id.
 */
export function changeRoom(roomId) {
    const {
        activeRoomId,
        setUser,
        socket,
        userId
    } = this.props;

    // no-op if room has not changed
    if (activeRoomId === roomId) return;

    socket.emit(UPDATE_USER, userId, {
        'rooms.active': roomId
    });

    setUser({
        rooms: { active: roomId }
    });
}
