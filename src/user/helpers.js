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
            if (value === '') {
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
