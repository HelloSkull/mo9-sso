# mo9-sso

适用场合：
当后台是node作为服务的时候

用途：
判断权限和获取用户状态等业务逻辑的模块


使用方法:

``` javascript
const Mo9SSO = require("mo9-sso");
const mo9SSO = new Mo9SSO();

...
       const queryParams = {
            url:`${config.VALIDATE_INTERFACE_SERVICE}/get_user_privileges`,
            queryParams: {
                userId,
                interface,
                projectId
            },
        };

 const resData =  mo9SSO.judgeTicket(queryParams);

```
请求参数和返回格式

**request**
``` javascript
    url//远程获取ticket信息的请求地址
    userId//当前用户的id
    interface//接口名称
    projectId//项目的id
```

**response**
``` javascript
    {
        "code" : {
            "type" : "integer",
            "description" : "报错号,0表示没有错误，1041表示登录失效"
        },
        "data" : {
            "description" : "返回信息"
            "type" : "object",
            "properties":{
                code: 0,
                  message: null,
                  data: {
                    entity: {
                           privileges: [
                             '/jerboa/article/back_add',
                             '/jerboa/article/back_get_page',
                             '/jerboa/author/back_get_id',
                             '/jerboa/article/back_update_id',
                             '/jerboa/author/back_get_page',
                             '/jerboa/article/back_batch_delete',
                             '/jerboa/author/back_update_id',
                             '/jerboa/article/back_get_id',
                             '/jerboa/author/back_add',
                             '/jerboa/author/back_batch_delete'
                           ]
                     }
                }
            }
        }
   }
```





