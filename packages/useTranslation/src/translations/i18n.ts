import i18next from 'i18next'
import I18NextHttpBackend, { HttpBackendOptions } from 'i18next-http-backend'

i18next.use(I18NextHttpBackend).init<HttpBackendOptions>({
  backend: {
    withCredentials: true,
    crossDomain: true,
  },
})
