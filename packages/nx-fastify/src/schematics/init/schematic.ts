import {
  noop,
  chain,
  Rule
} from '@angular-devkit/schematics';
import {
  ProjectType,
  addPackageWithInit,
  formatFiles,
  setDefaultCollection,
  addDepsToPackageJson,
  updateJsonInTree,
} from '@nrwl/workspace';
import { InitSchematicSchema } from './schema';
import {
  fastifyVersion,
  nxVersion,
} from "../../utils/versions";
/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = ProjectType.Application

function removeNrwlExpressFromDeps(): Rule {
  return updateJsonInTree('package.json', (json) => {
    delete json.dependencies['@plugified/nx-fastify'];
    return json;
  });
}

export default function(options: InitSchematicSchema): Rule {
  return chain([
    setDefaultCollection('@plugified/nx-fastify'),
    addPackageWithInit('@nrwl/node', options),
    options.unitTestRunner === 'jest'
      ? addPackageWithInit('@nrwl/jest')
      : noop(),
    removeNrwlExpressFromDeps(),
    addDepsToPackageJson(
      {
        fastify: fastifyVersion,
      },
      {
        '@plugified/nx-fastify': nxVersion,
      }
    ),
    formatFiles(options),
  ]);
}
