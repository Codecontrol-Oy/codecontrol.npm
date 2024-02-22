import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import getTranslations from '../../translations/getTranslations'

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function (request: FastifyRequest, reply: FastifyReply) {
    return { message: 'Hello API' }
  })
  interface TranslationRequestParams {
    language: string
    ns: string
  }
  fastify.get(
    '/locales/:language/:ns',
    async function (request: FastifyRequest<{ Params: TranslationRequestParams }>, reply: FastifyReply) {
      console.log(request.params)
      request.params.language

      return getTranslations(request.params.language, request.params.ns)
    }
  )
}
