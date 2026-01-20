import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Extend global with prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Lazy initialization - only create client when actually needed
let prismaClient: PrismaClient | null = null

function getPrismaClient(): PrismaClient {
  if (prismaClient) {
    return prismaClient
  }

  // Check if we're in a build/prerender context
  if (typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build') {
    // Return a mock during build - it won't be called
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('PrismaClient cannot be used during build time')
      }
    })
  }

  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  // Create pg pool
  const pool = new Pool({ connectionString })
  
  // Create PrismaPg adapter with the pool
  const adapter = new PrismaPg(pool)
  
  prismaClient = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prismaClient
  }

  return prismaClient
}

// Export a getter that lazily initializes
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getPrismaClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

export default prisma
