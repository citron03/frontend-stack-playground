import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware
const rawOrigins = process.env.BFF_CORS_ORIGIN;
let allowedOrigins =
  rawOrigins && rawOrigins.length > 0
    ? rawOrigins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
        .filter((origin) => origin !== '*') // Explicitly exclude wildcard origins
    : ['http://localhost:3000'];

if (rawOrigins && rawOrigins.includes('*')) {
  console.warn(
    '경고: BFF CORS 오리진에 와일드카드 (*)가 포함되어 있습니다. 이는 보안 위험을 초래할 수 있습니다.',
  );
}

if (allowedOrigins.length === 0) {
  console.warn(
    'BFF_CORS_ORIGIN이 유효한 오리진을 포함하지 않아 기본값으로 대체합니다: http://localhost:3000',
  );
  allowedOrigins = ['http://localhost:3000'];
}

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
