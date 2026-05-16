import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware
const allowedOrigins = process.env.BFF_CORS_ORIGIN
  ? process.env.BFF_CORS_ORIGIN.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : ['http://localhost:3000'];

app.use(
  '/api/*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['GET'], // Restrict to the methods currently used by BFF routes
  }),
);

// Routes
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello from BFF!',
    data: {
      id: 1,
      name: 'Sample Item',
      description: 'This data comes from the Hono BFF.',
    },
  });
});

const port = parseInt(process.env.PORT || '3001', 10);
console.log(`BFF server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
