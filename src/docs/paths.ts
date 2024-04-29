import { OpenAPIV3 } from 'openapi-types';
import { examplesPath, userPath } from './Examples/examples';


const allPaths: OpenAPIV3.PathsObject = {
  ...examplesPath, ...userPath

  // Add more imports and spread their paths if you have more files
};

export default allPaths;
