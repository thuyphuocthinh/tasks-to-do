module.exports.search = (req) => {
  let objectSearch = {
    keyword: "",
  };
  if (req.query.keyword) {
    objectSearch.keyword = req.query.keyword;
    const regex = new RegExp(objectSearch.keyword, "i");
    objectSearch.regex = regex;
  }
  return objectSearch;
};
