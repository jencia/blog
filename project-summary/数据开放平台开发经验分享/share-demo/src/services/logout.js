import request from '../utils/request';

import { logout as api } from '../config/service';

export function logout() {
    const options = {
        method: 'get'
    };

    return request(api.logout, options, true);
}
