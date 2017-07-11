var fetch = require ('node-fetch');
// 存储session和获取session方式由使用者去实现，这里只用作判断
function mo9SSO(){
    this.judgeTicket = function (params){
        return new Promise((resolve,reject)=>{
            this.getUserPrivileges(params).then(function(resultData){
                console.log("resultData ->",resultData);
                const  privileges  = resultData.data ?　resultData.data.entity.privileges : null;
                const { interface } = params.queryParams;
                console.log("privileges ->",privileges);
                console.log("interface ->",interface);
                let flag = false;
                privileges && privileges.forEach((v,i)=>{
                    if(v === interface){
                        flag = true;
                        return false;
                    }
                });
                console.log("flag ->",flag);
                resultData.data = flag;

                resolve(resultData);
            }).then(function(error){
                resolve ({ code:-1,error })
            })
        });
    };
    this.getUserPrivileges = function(params){
        return new Promise((resolve,reject)=>{

            if (params.queryParams) {
                params.url = `${params.url}?${(() => {
                    let queryParamsStr = '';
                    for (const i in params.queryParams) {
                        if (params.queryParams[i] || params.queryParams[i] === 0) {
                            queryParamsStr += `${i}=${params.queryParams[i]}&`;
                        }
                    }
                    return queryParamsStr.substring(0, queryParamsStr.length - 1);
                })()}`;
            }

            fetch(params.url)
                .then(res => res.json())
                .then(data => {
                    resolve(data);
                }).then(err=>{
                reject(err);
            })
        })
    };
}

module.exports = mo9SSO;
