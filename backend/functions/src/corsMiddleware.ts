import * as cors from 'cors';

const handleCors = cors({ origin: true });

// Middleware function to handle CORS
export const handleCorsMiddleware = (req: any, res: any, next: () => void) => {
  handleCors(req, res, () => {
    // res.set('Access-Control-Allow-Origin', '*');
    // res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    // res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // res.set('Access-Control-Allow-Credentials', 'true'); // Set Access-Control-Allow-Credentials header
    next();
  });
};

export default handleCorsMiddleware;