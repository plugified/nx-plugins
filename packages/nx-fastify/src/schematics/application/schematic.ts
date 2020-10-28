import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  url,
  Tree,
  SchematicContext,
  externalSchematic,
  MergeStrategy,
} from '@angular-devkit/schematics';
import { join, normalize, Path } from '@angular-devkit/core';
import {
  names,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  toFileName,
  formatFiles,
} from '@nrwl/workspace';
import { ApplicationSchematicSchema } from './schema';
import init from '../init/schematic';

const projectType = ProjectType.Application;

interface NormalizedSchema extends ApplicationSchematicSchema {
  projectName: string;
  projectRoot: string;
  appProjectRoot: Path;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  options: ApplicationSchematicSchema
): NormalizedSchema {
  const name = toFileName(options.name);
  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name;
  const appProjectRoot = join(
    normalize(projectRootDir(projectType)),
    normalize(projectDirectory)
  );

  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    appProjectRoot: appProjectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addMainFile(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
      }),
      move(options.projectRoot),
    ]),
    MergeStrategy.Overwrite
  );
}

export default function (schema: ApplicationSchematicSchema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const options = normalizeOptions(schema);
    return chain([
      init({ ...options, skipFormat: true }),
      externalSchematic('@nrwl/node', 'application', schema),
      addMainFile(options),
      formatFiles(options),
    ])(host, context);
  };
}
