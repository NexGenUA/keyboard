import { start } from './start/start';
import { modules } from './app/modules';

modules.list.forEach((module) => {
  start(module);
});
