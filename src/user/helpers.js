'use strict';

/**
 * Validates form input values and sets state.
 *
 * @param  {String} field - The input field.
 * @param  {String} value - The input value.
 * @param  {String} key   - The state key to set.
 * @return {Number}       - The truth value.
 */
export function isValid(field, value, key) {
    key = key || field + 'Error';
    let isValid = 1;

    switch (field) {
        case 'username':
            // character error
            if (!/^\w+$/.test(value)) {
                this.setState({
                    [key]: 'Characters must be alphanumeric.'
                });
                isValid = 0;
            }
            break;

        case 'password':
            // length too short
            if (value.length < 6) {
                this.setState({
                    [key]: 'Length too short.'
                });
                isValid = 0;
            }
            break;

        // rest of the fields are required (name, email)
        default:
            if (value === '') {
                this.setState({
                    [key]: 'Must not be blank.'
                });
                isValid = 0;
            }
    }

    // no error
    if (isValid && this.state[key]) {
        this.setState({
            [key]: ''
        });
    }

    return isValid;
}
