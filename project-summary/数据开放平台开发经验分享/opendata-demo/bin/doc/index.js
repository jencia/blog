
const Router = require('../model/Router');
const frontDesignDoc = require('./front-design-doc');

const router = new Router('src/pages');
const routerData = router.getMpaList();

frontDesignDoc.generate(routerData);
