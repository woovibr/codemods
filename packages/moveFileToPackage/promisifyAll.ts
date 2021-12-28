import util from 'util';

export const promisifyAll = (module, callbackParameterName) => {
  function isFunction(f) {
    return f && Object.prototype.toString.call(f) === '[object Function]';
  }

  if (!callbackParameterName) callbackParameterName = 'callback';

  Object.keys(module).forEach((key) => {
    if (!isFunction(module[key])) return;
    const args = module[key]
      .toString()
      .match(/function\s.*?\(([^)]*)\)/)[1]
      .split(',')
      .map((arg) => arg.replace(/\/\*.*\*\//, '').trim())
      .filter((arg) => arg);
    if (args.length == 0 || args[args.length - 1] != callbackParameterName)
      return;
    module[key] = util.promisify(module[key]);
  });

  return module;
};
