var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
  username: {
    type: Types.Text,
    initial: true,
    required: true,
    index: true
  },
  name: {
    type: Types.Name,
    initial: true,
    required: true,
    index: true
  },
  email: {
    type: Types.Email,
    initial: true,
    // required: true,
    index: true
  },
  password: {
    type: Types.Password,
    initial: true,
    required: true
  }
}, 'Permissions', {
  isAdmin: {
    type: Boolean,
    label: 'Can access Keystone',
    index: true
  }
});
// .add({
// 	name: {
// 		type: Types.Name,
// 		required: true,
// 		index: true
// 	},
// 	password: {
// 		type: Types.Password,
// 		initial: true,
// 		required: true
// 	}
// }, 'Permissions', {
// 	isAdmin: {
// 		type: Boolean,
// 		label: 'Can access Keystone',
// 		index: true
// 	}
// });

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
  return this.isAdmin;
});


/**
 * Registration
 */

User.defaultColumns = 'username, name, email, isAdmin';
User.register();
