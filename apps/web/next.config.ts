import withMdxCreate from '@next/mdx';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withMDX = withMdxCreate({
  // Optionally provide remark and rehype plugins
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
  },
  extension: /\.mdx?$/,
});

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    externalDir: true,
  },
  // useEffect 두 번 실행 방지
  reactStrictMode: false,
};

export default withVanillaExtract(withMDX(nextConfig));
