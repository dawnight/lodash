/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
// TODO set.baseToString 方法从哪里来
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.baseToString(value);
  return set;
}

export default addSetEntry;
