import { addProjectConfiguration, formatFiles, generateFiles, Tree, names } from '@nx/devkit'
import * as path from 'path'
import { NpmPackageGeneratorSchema } from './schema'
import { addTsConfigPath } from '@nx/js'

export async function npmPackageGenerator(tree: Tree, options: NpmPackageGeneratorSchema) {
  const projectRoot = `packages/${options.name}`
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/${options.name}/src`,
    targets: {},
  })

  if (options.name.startsWith('@'))
    throw new Error('Dont include the scope in package name all packages will be scoped to @codecontrol automagically')
  const generatedNames = names(options.name)
  const substitutions = {
    ...options,
    name: generatedNames.fileName,
    originalName: options.name,
    fileName: generatedNames.fileName,
    className: options.name.startsWith('use') ? options.name : generatedNames.className,
  }
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, substitutions)
  addTsConfigPath(tree, `@codecontrol/${options.name}`, [`packages/${options.name}/src/index.ts`])
  await formatFiles(tree)
}

export default npmPackageGenerator
