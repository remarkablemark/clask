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

    // validate `username` and `email` over the server for duplicates
    if (value && (field === 'username' || field === 'email')) {
        serverValidation(field, value, (error, response) => {
            if (error || !response.ok) {
                console.log(error, response); // eslint-disable-line no-console
                return;
            }

            // key found
            if (response.body.length) {
                this.setState({
                    [key]: (
                        field === 'username' ?
                        'Name is taken.' :
                        'Email already exists.'
                    )
                });
            }
        });
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

/**
 * Validates the field value over the server.
 * For inputs `username` and `email`.
 *
 * @param {String}             field    - The input field.
 * @param {String}             value    - The input value.
 * @param {serverValidationCb} callback - The callback.
 */
function serverValidation(field, value, callback) {
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
}

/**
 * Callback for server validation.
 *
 * @callback serverValidationCb
 * @param {Object} error    - The error.
 * @param {Object} response - The response.
 */
