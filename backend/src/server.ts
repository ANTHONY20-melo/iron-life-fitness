import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/environment'
import prisma from './config/database'
import routes from './routes'
import { errorHandler } from './middlewares/errorHandler'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()

// Security
app.use(helmet())
app.use(cors({ origin: env.corsOrigin, credentials: true }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Iron Life Fitness API',
      version: '1.0.0',
      description: 'Complete gym management system API',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
app.use('/api', routes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

// Start
async function main() {
  await prisma.$connect()
  console.log('✅ Database connected')
  app.listen(env.port, () => {
    console.log(`🏋️ Iron Life Fitness API running on port ${env.port}`)
    console.log(`📚 Swagger docs: http://localhost:${env.port}/api-docs`)
  })
}

main().catch((e) => {
  console.error('❌ Failed to start server:', e)
  process.exit(1)
})

export default app
