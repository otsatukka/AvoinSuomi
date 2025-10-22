# budjetinesitys

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### deployment command in render
```
cd budjetinesitys && npm install && npm run build && cd ../budjetinesitysserveri && npm install && mkdir -p dist && cp -R ../budjetinesitys/dist/* dist/
```
# budjetinesitysserver

### deployment locally
```
cd budjetinesitysserveri
node server.js
```