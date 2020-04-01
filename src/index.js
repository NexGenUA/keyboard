import { start } from './core/start';
import { modules } from './app/modules';

modules.list.forEach((module) => {
  start(module);
});
