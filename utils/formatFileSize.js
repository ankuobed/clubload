const formatFileSize = (size) => {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1000));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
};

module.exports = formatFileSize;
