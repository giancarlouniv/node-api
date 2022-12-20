module.exports = {
  // single transformation
  resourceSingleItem(item) {
    return {
      id: item.id,
      nome: item.name,
    };
  },

  // multiple transformation
  resourceItems(items) {
    return items.map((item) => this.resourceSingleItem(item));
  },
};
