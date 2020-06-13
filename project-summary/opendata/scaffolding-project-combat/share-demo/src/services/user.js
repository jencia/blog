import request from '../utils/request';

import  { user as api }  from '../config/service';

export function getUserList() {
    return request(api.getUserList, true);
}
