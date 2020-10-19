import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { NxFastifySchematicSchema } from './schema';

describe('nx-fastify schematic', () => {
  let appTree: Tree;
  const options: NxFastifySchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@plugified/nx-fastify',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('nx-fastify', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
