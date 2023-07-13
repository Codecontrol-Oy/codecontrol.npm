import { addProjectConfiguration, formatFiles, generateFiles, Tree, names } from '@nx/devkit'
import * as path from 'path'
import { NpmPackageGeneratorSchema } from './schema'

export async function npmPackageGenerator(tree: Tree, options: NpmPackageGeneratorSchema) {
  const projectRoot = `packages/${options.name}`
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/${options.name}/src`,
    targets: {},
  })

  const generatedNames = names(options.name)
  const substitutions = {
    ...options,
    name: generatedNames.fileName,
    originalName: options.name,
    fileName: generatedNames.fileName,
    className: options.name.startsWith('use') ? options.name : generatedNames.className,
  }
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, substitutions)
  await formatFiles(tree)
}

export default npmPackageGenerator
