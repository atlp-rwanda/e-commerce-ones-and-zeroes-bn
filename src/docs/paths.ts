import { OpenAPIV3 } from 'openapi-types';
import examples from './Examples/examples';


const allPaths: OpenAPIV3.PathsObject = {
  ...examples,

  // Add more imports and spread their paths if you have more files
};

export default allPaths;
