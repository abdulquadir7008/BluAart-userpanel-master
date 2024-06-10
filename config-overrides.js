/* config-overrides.js */

module.exports = function override(config, env) {
    if (process.env.DEV_MODE) {
        config.mode = 'development';
        config.optimization.minimize = false;
    }
    config.output.filename = 'bundle.js';
    return config;
}