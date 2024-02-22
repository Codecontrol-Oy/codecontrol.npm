import { PrismaClient } from '@prisma/client'

export default async function getTranslations(language: string, ns: string) {
  const prisma = new PrismaClient()
  let fromFile
  try {
    fromFile = require(`../assets/translations/${language}.json`)
  } catch (e) {
    console.log({ error: e })
  }
  const translations = await prisma.translation.findMany({
    where: {
      language: {
        name: language,
      },
      namespace: {
        name: ns,
      },
    },
  })
  const fromDb = translations.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.key]: curr.value,
    }),
    {}
  )
  const combined = {
    ...fromFile[ns],
    ...fromDb,
  }
  console.log({ combined, fromFile: fromFile[ns], fromDb })
  return combined
}
