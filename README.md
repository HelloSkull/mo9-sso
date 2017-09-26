# mo9-sso

适用场合：
当后台是node作为服务的时候

用途：
判断权限和获取用户状态等业务逻辑的模块


使用方法:

``` javascript
    mo9SSODealData: async (param, ctx) => {
        console.log('param ->', param);
        const { ticket, userId, interface } = param;
        const params = {
            interfaces: config.INTERFACES,
            params: {
                userId,
                ticket,
                ip: ctx.request.host,
                accessKeyId: config.PROJECT_ACCESS_KEY_ID,
                accessKeySecret: config.PROJECT_ACCESS_KEY_SECRET,
                code: interface
            }
        }
        return mo9SSO.judge(params);
    }

```
请求参数和返回格式

**request**
``` javascript
    userId//用户的id
    ticket//用户的ticket
    ip//ip地址
    accessKeyId//项目的accessKeyId，具体请登录大后台（bk.mo9.com）看
    accessKeySecret//项目的accessKeySecret，具体请登录大后台（bk.mo9.com）看
    code//接口的权限码
```

**response**
``` javascript
    {
        "code" : {
            "type" : "integer",
            "description" : "报错号,0表示没有错误，11080001表示没有权限"
        },
        "data" : {
            "description" : "返回信息"
            "type" : "object",
            "properties":{
                code: 0
            }
        }
   }
```





