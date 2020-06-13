const Generator = require('../model/Generator');

module.exports = {
    name: 'model',
    type: 'model',
    prompt: [
        {
            name: 'filename',
            message: '请填写文件名称：',
            validate: value => {
                if (!value) return '不能为空';
                if (!/^[a-z][a-zA-Z0-9]+$/.test(value)) {
                    return '命名不符合规范，请填写\'小驼峰\'形式的名称';
                }
                return true;
            }
        }
    ],
    then: ({ filename }) => {
        const generator = new Generator(`src/models`);

        generator
            .add(`${filename}.js`,
                'export default {\r\n' +
                `    namespace: '${filename}',\r\n` +
                '    state: {\r\n' +
                '        xxx: \'\'\r\n' +
                '    },\r\n' +
                '    reducers: {\r\n' +
                '        setXxx: (state, { payload }) => ({ ...state, xxx: payload })\r\n' +
                '    },\r\n' +
                '    effects: {\r\n' +
                '        *getXxx ({ payload }, { call, put }){\r\n' +
                '            // call调用异步方法，put调用reducers里的方法\r\n' +
                '            // window.requestFn代表一个网络请求方法，方法的传参参数放在call第二参数上\r\n' +
                '            const data = yield call(window.requestFn, payload);\r\n' +
                '\r\n' +
                '            yield put({ type: \'setXxx\', payload: data });\r\n' +
                '        }\r\n' +
                '    }\r\n' +
                '};\r\n'
            )
            .run();
    }
}