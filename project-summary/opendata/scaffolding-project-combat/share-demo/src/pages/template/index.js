import dva from 'dva';

// shareui
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';// shareui-font版本迁移完成之后删除该依赖
import '@share/shareui-html';
import '@share/shareui-font';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('../../models/count'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
