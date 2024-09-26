// import dbFunctions from './dbFunctions';
// import express from 'express';
// import { getSession } from 'next-auth/react';

// const router = express.Router();

// router.get('/blogs', async (req, res) => {
//   const session = await getSession({ req });

//   if (!session) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const userEmail = session.user?.email ?? '';

//   try {
//     const blogs = await dbFunctions.getBlogs(userEmail);
//     res.json(blogs);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// export default router;