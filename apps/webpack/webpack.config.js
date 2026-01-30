const path = require('path');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  name: 'webpack setting test',
  mode: 'development', // or 'production'
  devtool: 'eval', // or hidden-source-map
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // 설정시 entry  확장자 생략이 가능하다.
  },
  entry: {
    // 입력
    app: ['./index'],
    // 파일 내부에서 다른 파일을 호출한다면, webpack이 자동으로 이를 파악해준다. 따라서 entry에 추가하지 않아도 된다.
  },
  module: {
    rules: [
      {
        test: /\.jsx?$|\.tsx?$/,
        loader: 'babel-loader', // bebel을 webpack과 연결해준다.
        options: {
          // babel의 옵션들
          presets: [
            [
              '@babel/preset-env',
              {
                // preset의 설정
                targets: { browsers: ['> 5% in KR', 'last 2 chrome versions'] },
                debug: true,
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          plugins: ['react-refresh/babel'],
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
    ],
  },
  plugins: [
    // webpack 추가 기능 확장
    new LoaderOptionsPlugin({ debug: true }),
    new ReactRefreshWebpackPlugin(),
  ],
  output: {
    // 출력
    path: path.join(__dirname, 'dist'), // webpack.config.js 위치에 있는 dist 폴더 (./dist)
    filename: '[name].js', // 합쳐진 파일의 이름
    publicPath: '/dist',
  },
  devServer: {
    // 빠른 어플리케이션 개발을 위한 개발 환경을 설정한다. (개발 편의를 위한 서버)
    // hot loader 기능 추가 - 메모리에 결과물을 저장, 변경 사항을 감시하여 발견시 결과물 실시간 수정
    devMiddleware: { publicPath: '/dist' }, // 결과물 위치
    hot: true,
    static: { directory: path.resolve(__dirname) }, // 실제 static 파일 위치 (ex. index.html)
  },
};

// webpack.js docs : https://webpack.js.org/concepts/
// babel docs : https://babeljs.io/docs/en/
// babel-loader : https://www.npmjs.com/package/babel-loader
// browserslist : https://github.com/browserslist/browserslist
