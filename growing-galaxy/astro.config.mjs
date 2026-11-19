import { defineConfig } from 'astro/config';
import amplify from 'astro-aws-amplify'

export default defineConfig({
  output: 'server',
  adapter: amplify(),
});