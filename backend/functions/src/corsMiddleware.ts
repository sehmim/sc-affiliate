import * as cors from 'cors';

const handleCors = cors({
  origin: '*',
  methods: 'GET,PUT,POST,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
});

export const handleCorsMiddleware = (req: any, res: any, next: () => void) => {
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.status(204).send('');
  } else {
    handleCors(req, res, () => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.set('Access-Control-Allow-Credentials', 'true');
      next();
    });
  }
};

export default handleCorsMiddleware;