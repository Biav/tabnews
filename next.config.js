module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/\/src\/tests\//)); // <<<<<====== This line solved my issue

    return config;
  },
};
