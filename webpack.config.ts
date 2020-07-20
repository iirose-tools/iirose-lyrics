import * as path from 'path';
import { promisify } from 'util';
import { Configuration } from 'webpack';
// @ts-ignore
import WebpackExtensionManifestPlugin from 'webpack-extension-manifest-plugin';
import WebpackUserscript = require('webpack-userscript');

const isProduction = process.env.NODE_ENV === 'production';

async function userscript(): Promise<Configuration> {
  const readPackageJson = require('read-package-json');
  const { name } = await promisify(readPackageJson)('./package.json');

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src', 'userscript', 'index.ts'),
    output: {
      path: path.resolve(__dirname, 'lib', 'userscript'),
      filename: `${name}.user.js`
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'lib', 'userscript')
    },
    plugins: [
      new WebpackUserscript({
        headers: {
          version: isProduction ? '[version]' : '[version]-build.[buildNo]',
          include: 'https://iirose.com/messages.html',
          grant: 'GM_xmlhttpRequest'
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: 'src/userscript/tsconfig.json'
          }
        }
      ]
    }
  };
}

function chromeBackground(): Configuration {
  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src', 'chrome', 'background', 'index.ts'),
    output: {
      path: path.resolve(__dirname, 'lib', 'chrome'),
      filename: 'background.js'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: 'src/chrome/background/tsconfig.json'
          }
        }
      ]
    }
  };
}

async function chromeContent(): Promise<Configuration> {
  const readPackageJson = require('read-package-json');
  const { name, version, description } = await promisify(readPackageJson)(
    './package.json'
  );

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src', 'chrome', 'content', 'index.ts'),
    output: {
      path: path.resolve(__dirname, 'lib', 'chrome'),
      filename: 'content.js'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
      new WebpackExtensionManifestPlugin({
        config: {
          base: require('./src/chrome/manifest.json'),
          extend: {
            name,
            version,
            description,
            web_accessible_resources: ['injected.js']
          }
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: 'src/chrome/content/tsconfig.json'
          }
        }
      ]
    }
  };
}

function chromeInjected(): Configuration {
  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src', 'chrome', 'injected', 'index.ts'),
    output: {
      path: path.resolve(__dirname, 'lib', 'chrome'),
      filename: 'injected.js'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            configFile: 'src/chrome/injected/tsconfig.json'
          }
        }
      ]
    }
  };
}

export default Promise.all([
  userscript(),
  chromeBackground(),
  chromeContent(),
  chromeInjected()
]);
