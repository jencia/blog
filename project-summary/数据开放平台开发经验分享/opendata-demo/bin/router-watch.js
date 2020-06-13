const Router = require('./model/Router');
const PAGE_ROOT = './src/pages';                    // 页面根路径
const OUTPUT_PATH = './src/config/mapRoutes.js';    // 配置文件输出路径
const router = new Router(PAGE_ROOT, OUTPUT_PATH);

router.watch();
