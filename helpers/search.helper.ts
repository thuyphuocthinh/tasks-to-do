import { Request } from "express";

export const search = (req: Request) => {
  let objectSearch: { keyword: string; regex?: RegExp } = {
    keyword: "",
  };
  if (req.query.keyword) {
    const keyword = req.query.keyword.toString();
    objectSearch.keyword = keyword;
    const regex = new RegExp(objectSearch.keyword, "i");
    objectSearch.regex = regex;
  }
  return objectSearch;
};
