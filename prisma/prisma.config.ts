import path from 'node:path'
import type { PrismaConfig } from 'prisma'
import 'dotenv/config'

const config: PrismaConfig = {
  schema: path.join(__dirname, 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL,
  },
}

export default config
