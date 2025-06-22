import type { Config } from './config.interface';
const config: Config = {
  webhookUrl: 'https://jsonplaceholder.typicode.com/todos',
};

export default (): Config => config;
