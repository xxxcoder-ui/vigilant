/**
 * Base webpack config used across other specific configs
 */

const path = require('path')

// const { dependencies: externals } = require('./app/package.json')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env', '@babel/react'],
              plugins: [
                [
                  '@babel/transform-runtime',
                  {
                    regenerator: true
                  }
                ],
                [
                  '@babel/proposal-decorators',
                  {
                    legacy: true
                  }
                ],
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                'lodash'
              ]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: {
                'primary-color': '#2074ee',
                'link-color': '#2074ee',
                'font-family': `"Metropolis", -apple-system,"Helvetica Neue", Helvetica`,
                'tooltip-bg': '#202124'
              }
            }
          }
        ]
      },
      {
        test: /\.(css)$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ],
        include: /node_modules/
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf)$/,
        loader: 'url-loader'
      }
    ]
  },

  output: {
    path: path.join(__dirname, 'app'),
    filename: 'bundle.js',
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  // https://webpack.github.io/docs/configuration.html#resolve
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    modules: [path.join(__dirname, 'app'), 'node_modules']
  }

  // externals: Object.keys(externals || {})
}
