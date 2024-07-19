module.exports.pagination = (req, objectPagination, countRecords) => {
  if (req.query.page) {
    objectPagination.currentPage = Number(req.query.page);
    if (isNaN(objectPagination.currentPage)) {
      objectPagination.currentPage = 1;
    }
    
    if (req.query.limitItems) {
      objectPagination.limitItems = parseInt(req.query.limitItems);
    }
    objectPagination.skip =
      (objectPagination.currentPage - 1) * objectPagination.limitItems;
  }

  const totalPage = Math.ceil(countRecords / objectPagination.limitItems);
  objectPagination.totalPage = totalPage;
  return objectPagination;
};
