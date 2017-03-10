
function HtmlWebpackPrefixPlugin (options) {
  options = options || {};
  this.outputPath = options.outputPath;
  this.prefix = options.prefix;
}

HtmlWebpackPrefixPlugin.prototype.apply = function (compiler) {
  var self = this;
  // Hook into the html-webpack-plugin processing
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-alter-chunks', function(chunks, callback) {
      self.chunkNames = [].concat.apply([], chunks
        .map(chunk => chunk.files))
        .filter(fileName => fileName.indexOf('.js.map') === -1);

        return chunks;
    });
    
    compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
      const addPrefixToTag = (chunkName) => {
        const searchValue = `src="${chunkName}"`;
        
        const chunkNameWithPrefix = self.prefix ? `${self.prefix}${chunkName}` : chunkName;
        const newValue = `src="${chunkNameWithPrefix}"`;
        const regex = new RegExp("src=\"" + chunkName + "\"", "g"); 
        htmlPluginData.html = htmlPluginData.html.replace(regex, newValue);
      }

      self.chunkNames
        .forEach(addPrefixToTag);
        
        
        callback(null);
        
        return htmlPluginData;

    });
  });
};


module.exports = HtmlWebpackPrefixPlugin;