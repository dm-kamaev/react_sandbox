"use strict";

var ENV = process.env.NODE_ENV || 'production';
var webpack = require('webpack');

module.exports = {
  entry: "./client/app.js",
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel', // ?optional[]=runtime // позволит выносить функции es6 в отедeльные функции
      loader: 'babel-loader?presets[]=es2015&presets[]=react', // ?optional[]=runtime // позволит выносить функции es6 в отедeльные функции
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
         NODE_ENV: JSON.stringify(process.env.NODE_ENV), // Чтобы React and React-dom не ругался на минификацию
      },
    }),
  ],
  watch:true,
  // devtool: "source-map", // use debugger; in code
};


if (ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        unsafe:true
      },
    })
  );
}