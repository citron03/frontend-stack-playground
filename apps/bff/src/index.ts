import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware
app.use('/api/*', cors());

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

const port = 3001;
console.log(`BFF server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
