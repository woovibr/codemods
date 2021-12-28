export default {
  ...mutation,

  extensions: {
    requiredRoles: [ADMIN_ROLE],
    myself: 'id',
    authenticatedOnly: true
  }
};
