import { Linter } from '@nrwl/workspace';

export interface ApplicationSchematicSchema {
  name: string;
  skipFormat: boolean;
  skipPackageJson: boolean;
  directory?: string;
  unitTestRunner: 'jest' | 'none';
  tags?: string;
  linter: Linter;
  frontendProject?: string;
  babelJest?: boolean;
}
