"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.IMutation = exports.IQuery = exports.Category = exports.UpdateCategoryInput = exports.CreateCategoryInput = void 0;
class CreateCategoryInput {
    name;
    description;
    parentCategoryId;
}
exports.CreateCategoryInput = CreateCategoryInput;
class UpdateCategoryInput {
    name;
    description;
    parentCategoryId;
}
exports.UpdateCategoryInput = UpdateCategoryInput;
class Category {
    __typename;
    id;
    name;
    description;
    createdAt;
    updatedAt;
    subcategories;
    parentCategory;
    parentCategoryId;
}
exports.Category = Category;
class IQuery {
    __typename;
}
exports.IQuery = IQuery;
class IMutation {
    __typename;
}
exports.IMutation = IMutation;
class User {
    __typename;
    id;
    email;
    name;
    createdAt;
    updatedAt;
}
exports.User = User;
//# sourceMappingURL=graphql.js.map