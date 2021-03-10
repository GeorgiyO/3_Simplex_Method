require("neko-utils").addAllExtraFunctions();

const view = require("./view");
const model = require("./model");

view.createRoot(model.globalState);
view.draw();
