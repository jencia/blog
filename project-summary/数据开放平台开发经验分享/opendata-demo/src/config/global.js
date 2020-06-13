import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; // shareui-font版本迁移完成之后删除该依赖
import '@share/shareui-html';
import '@share/shareui-html/dist/patch.css';
import '@share/shareui-font';
import '@/assets/styles/public.scss';

import { isDev } from '@/config/service';

/* eslint-disable no-empty-function */
if (!isDev) {
    window.console.log = () => {};
    window.console.info = () => {};
}
