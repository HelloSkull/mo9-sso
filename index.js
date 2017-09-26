var fetch = require('node-fetch');
const crypto = require('crypto');
// 存储session和获取session方式由使用者去实现，这里只用作判断
function mo9SSO() {

    this.judge = function (param) {
        const { interfaces, params } = param;
        const { ticket, ip, accessKeyId, accessKeySecret, code, userId } = params;
        // console.log('userId ->', userId);
        // console.log('interfaces ->', interfaces);
        // console.log('params ->', params);
        // console.log('ticket->', ticket);
        // console.log('accessKeyId ->', accessKeyId);

        const identityAuthenticationParams = {
            url: interfaces.identityAuthentication,
            type: 0,
            queryParams: { ticket, userId },
            accessKeySecret,
            accessKeyId
        }

        const securityAuthenticationParams = {
            url: interfaces.securityAuthentication,
            type: 0,
            queryParams: { ip, accessKeyId },
            accessKeySecret,
            accessKeyId
        }

        const authorizationAuthenticationParams = {
            url: interfaces.authorizationAuthentication,
            type: 0,
            queryParams: { code, userId, accessKeyId },
            accessKeySecret,
            accessKeyId
        }
        const identityAuthentication = this.fetchFunc(identityAuthenticationParams);
        const securityAuthentication = this.fetchFunc(securityAuthenticationParams);
        const authorizationAuthentication = this.fetchFunc(authorizationAuthenticationParams);

        return Promise.all([identityAuthentication, securityAuthentication, authorizationAuthentication]).then(result => {
            let backData = {};
            console.log('result ->', result);
            //三个条件全部满足才能通过
            if (result[0].code === 0 && result[1].code === 0 && result[2].code === 0) {
                backData = {
                    code: 0,
                    data: []
                }
            } else {
                backData = {
                    code: 11020001,
                }
            }
            return backData;
        })

    }

    this.fetchFunc = function (params) {
        const { queryParams, formParams, accessKeySecret, accessKeyId, type } = params;
        const Timestamp = new Date().getTime();
        let Content = "";
        let Signature = "";
        const P = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };

        return new Promise((resolve, reject) => {
            if (type !== 0) {
                P.method = "POST";
                const formParamArr = [];
                if (formParams) {
                    for (const i in formParams) {
                        if (this.judgeHasKey(i, formParams)) {
                            formParamArr.push(`${i}=${this.dealValue(formParams[i])}`);
                        }
                    }
                }
                Content = formParamArr.join('&');
                return formParamArr.join('&');
            } else {
                P.method = "GET";
                const queryParamArr = [];
                params.url = `${params.url}?${(() => {
                    for (const i in queryParams) {
                        if (this.judgeHasKey(i, queryParams)) {
                            queryParamArr.push(`${i}=${this.dealValue(queryParams[i])}`);
                        }
                    }
                    Content = queryParamArr.join('&');
                    return queryParamArr.join('&');
                })()}`;
            }

            Signature = this.md5(`${Content}${Timestamp}${accessKeySecret}`);
            P.headers = {
                Timestamp,
                Signature,
                ["Access-Key-Id"]: accessKeyId
            }
            // console.log('params.url->', params.url);
            // console.log('P->', P);

            fetch(params.url, P)
                .then(res => res.json())
                .then(data => {
                    resolve(data);
                }).then(err => {
                    reject(err);
                })
        })
    }

    this.judgeHasKey = function (key, obj) {
        return Object.prototype.hasOwnProperty.call(obj, key) && obj.hasOwnProperty(key) !== 'undefined';
    }

    this.dealValue = function (value) {
        // 如果是字符串，去掉前后空格
        if (Object.prototype.toString.call(value) === '[object String]') {
            return value.replace(/(^\s*)|(\s*$)/g, '');
        } else {
            return value;
        }
    },
        this.md5 = function (encryptString) {
            const hasher = crypto.createHash("md5");
            hasher.update(encryptString);
            encryptString = hasher.digest('hex');
            return encryptString;
        }
}

module.exports = mo9SSO;
