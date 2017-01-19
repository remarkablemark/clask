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

    // update active room and reset mentions
    socket.emit(UPDATE_USER, userId, {
        'rooms.active': roomId,
        [`rooms.history.${roomId}.mentions`]: 0
    });

    setUser({
        rooms: {
            active: roomId,
            history: {
                [roomId]: {
                    mentions: 0
                }
            }
        }
    });
}
