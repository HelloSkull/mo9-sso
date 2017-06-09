var fetch = require ('node-fetch');
// 存储session和获取session方式由使用者去实现，这里只用作判断
function mo9SSO(){
    this.judgeTicket = function (opt){
        var url = opt.url;
        var userInfo = opt.userInfo;
        let data = { code:0 };
        if(!userInfo){
            return new Promise((resolve,reject)=>{
                this.getTicketPromise(url).then(function(resData){
                    const { resultData,session } =  resData;
                    //如果返回有数据的话就设置cookie
                    if(resultData) {
                        data = {
                            code:0,
                            data:{ session }
                        };
                    }else{
                        data = {
                            code:1041,
                            data:null,
                            message:"登录失效，即将跳转到登录页面！"
                        };
                    }
                    resolve(data) ;

                }).then(function(error){
                    resolve ({ code:-1,error })
                })
            })
        }else{
            return  data;
        }
    };
    this.getTicketPromise = function(url){
        return new Promise((resolve,reject)=>{
            const params = {
                url
            };
            fetch(params.url)
                .then(res => res.json())
                .then(data => {
                    const obj = {
                        resultData:data,
                        session:{
                            userInfo:data
                        }
                    };
                    resolve(obj);
                }).then(err=>{
                    reject(err);
                })
            })
        };
    }

module.exports = mo9SSO;
