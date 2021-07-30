const fg = require("fast-glob");

module.exports.autopath = function (path, basepath) {
  return path.replace("?", basepath).replace("//", "/");
};

module.exports.root = function (root) {
  if (root == "user" || root == "users") root = "accounts";
  root = process.env["PLOP_ROOT_" + root.toUpperCase()] ?? root;
  if (root == "index") {
    const indexphp = fg.sync(["**/index.php"], {
      onlyFiles: true,
      absolute: true,
      deep: 2,
    });
    if (indexphp.length) return indexphp[0].replace("/index.php", "");
  } else {
    const folder = fg.sync(["**/" + root], {
      onlyDirectories: true,
      absolute: true,
    });
    if (folder.length) return folder[0];
  }
  return "./";
};

module.exports.languages = function () {
  return fg
    .sync(["**/languages/??.php"], { onlyFiles: true, objectMode: true })
    .map(function (file) {
      return file.name.replace(".php", "");
    });
};

module.exports.blueprintTypes = function () {
  // merge without duplicates
  let types = [
    "fields",
    "files",
    "layouts",
    "pages",
    "sections",
    "users",
  ].concat(
    fg
      .sync(["**/blueprints/*"], { onlyDirectories: true, objectMode: true })
      .map(function (folder) {
        return folder.name;
      })
  );
  return types
    .filter((item, index) => {
      return types.indexOf(item) == index;
    })
    .sort();
};

module.exports.userRoles = function () {
  let roles = fg
    .sync(["**/blueprints/users/*.yml"], { onlyFiles: true, objectMode: true })
    .map(function (file) {
      return file.name.replace(".yml", "");
    });
  if (roles.indexOf("admin") == -1) roles.push("admin");
  return roles.sort();
};
