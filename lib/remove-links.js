const regex = /\[(.+?)\]\(.+?\)/g;

module.exports = (notes) => {
  return notes.replace(regex, function(match, p1) {
    return p1;
  });
};
