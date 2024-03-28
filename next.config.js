const withImages = require("next-images");

module.exports = withImages({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: /node_modules\/@apollo\/server/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-proposal-class-properties"],
            },
          },
        ],
      });
    }
    return config;
  },
});
