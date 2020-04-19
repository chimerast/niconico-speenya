import path from 'path';
import { exec } from 'child_process';
import { Configuration, DefinePlugin } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';

const config: Configuration = {
  mode: 'production',
  entry: {
    background: path.resolve(__dirname, './extension/scripts/background.ts'),
    content_script: path.resolve(__dirname, './extension/scripts/content_script.ts'),
  },
  output: {
    path: path.resolve(__dirname, './dist/extension/scripts'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new DefinePlugin({
      'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL || 'http://localhost:3000'),
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, './extension/manifest.json'),
        to: path.resolve(__dirname, './dist/extension'),
      },
      {
        from: path.resolve(__dirname, './extension/images'),
        to: path.resolve(__dirname, './dist/extension/images'),
      },
      {
        from: path.resolve(__dirname, './extension/styles'),
        to: path.resolve(__dirname, './dist/extension/styles'),
      },
    ]),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (_compilation) => {
          const script = path.resolve(__dirname, './extension/icons/convert.sh');
          const target = path.resolve(__dirname, './dist/extension/icons');
          exec(`${script} ${target}`, (_error, stdout, stderr) => {
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
          });
        });
      },
    },
  ],
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
};

export default config;
