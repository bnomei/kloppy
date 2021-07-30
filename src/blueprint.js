const F = require("./utils/f.js");
const helpers = require("./utils/helpers.js");
const kirby = require("./utils/kirby.js");
const prompts = require("./utils/prompts.js");
const yaml = require("js-yaml");

module.exports = function (plop) {
  const basepath = kirby.root("blueprints");

  plop.setHelper("filenameWithoutExtension", helpers.filenameWithoutExtension);
  plop.setHelper("trimFirstDot", helpers.trimFirstDot);

  plop.setGenerator("blueprint", {
    description: "make a blueprint file",
    prompts: [
      {
        type: "list",
        name: "type",
        choices: kirby.blueprintTypes(),
      },
      prompts.template(),
      prompts.extension(".yml"),
      prompts.import(),
    ],
    actions: [
      function (data) {
        data.path =
          basepath +
          "/{{ type }}/{{filenameWithoutExtension template }}.{{trimFirstDot extension }}";
        data.data = F.load(data.import);
        data.yaml = yaml.dump(data.data);
        return data.data;
      },
      {
        type: "add",
        path: "{{ path }}",
        templateFile: "blueprint.{{trimFirstDot extension }}.hbs",
      },
      function (data) {
        return F.clipboard(plop, data.path, "@PLOP_CURSOR");
      },
    ],
  });
};
