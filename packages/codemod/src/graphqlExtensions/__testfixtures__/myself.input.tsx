export default {
  ...mutation,
  requiredRoles: [ADMIN_ROLE],
  myself: 'id',
  authenticatedOnly: true,
};
