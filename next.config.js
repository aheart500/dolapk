const withImages = require("next-images");
module.exports = withImages({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /@apollo\/server/,
        use: "null-loader",
      });
    }
    return config;
  },
});
