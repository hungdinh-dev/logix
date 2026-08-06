import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
  images: {
    qualities: [100, 75],
  },
}

export default nextConfig
