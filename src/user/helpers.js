'use strict';

/**
 * Validates form input values and sets state.
 *
 * @param  {String}  field - The input field.
 * @param  {String}  value - The input value.
 * @return {Boolean}       - The truth value.
 */
export function isValid(field, value) {
    const key = field + 'Error';
    let errorText = '';

    switch (field) {
        case 'username':
            // character error
            if (!/^\w+$/.test(value)) {
                errorText = 'Characters must be alphanumeric.';
            }
            break;

        case 'password':
            // length too short
            if (value.length < 6) {
                errorText = 'Length too short.';
            }
            break;

        // rest of the fields are required (name, email)
        default:
            // blank
            if (!value) {
                errorText = 'Must not be blank.';
            }
    }

    // no text means valid
    const isValid = !errorText;

    // no error
    if (isValid && this.state[key]) {
        this.setState({
            [key]: ''
        });

    // error
    } else if (!isValid && this.state[key] !== errorText) {
        this.setState({
            [key]: errorText
        });
    }

    return isValid;
}

/** Global debounce timer and delay used in `serverValidation()`. */
let timer = null;
const delay = 300; // milliseconds

/**
 * Validates the field value on the server.
 * For inputs `username` and `email`.
 *
 * @param {String}             field    - The input field.
 * @param {String}             value    - The input value.
 * @param {validateOnServerCb} callback - The callback.
 */
export function validateOnServer(field, value, callback) {
    // debounce the GET request
    clearTimeout(timer);
    timer = setTimeout(() => {
        window.requirejs(['superagent'], (request) => {
            request
                .get('/api/users')
                .query({ [field]: value })
                .end((error, response) => {
                    if (typeof callback === 'function') {
                        callback(error, response);
                    }
                });
        });
    }, delay);
}

/**
 * Callback for `validateOnServer`.
 *
 * @callback validateOnServerCb
 * @param {Object} error    - The error.
 * @param {Object} response - The response.
 */
