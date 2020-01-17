
/** GET users listing. */
export default {
  method: 'GET',
      path: '/users',
      controller: async (req, res, next)  => {
        res.send('respond with a resource');
      }
};
