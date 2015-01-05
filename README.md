cartman-test
============

一个基于js的http service测试框架

##起步
一个基于js的http service测试框架，需要使用该测试框架，请参考以下步骤。

1. 安装NodeJS,具体方法请参考[NodeJS官网]( http://nodejs.org/)；

2. 将该项目克隆到本地，并修改app.js中的proxyServer和proxyServerPort为需要测试的项目地址和端口；

3. 编写测试脚本文件，放到项目的/public/test文件夹下，脚本文件写法请看后续介绍;

4. 在cmd中打开到项目路径并运行一下命令：

    >npm install
    
    >node app

5. 在浏览器中打开[http://localhost:3000/index.html](http://localhost:3000/index.html),默认端口是3000，
可修改app.js倒数第三行数字自行设定;

6. 在打开页面的选择框中选择相应的脚本，点‘运行’即可。

##测试页面
1. 左边为测试进度条和测试分组及结果，测试结果通过颜色区分，

2. 绿色代表成功，红色代表失败，否则表示未执行。

3. 右边为测试脚本选择框、运行按钮和简易导航栏。

4. 通过测试脚本选择框选择测试文件（/public/test文件夹下的所有js文件，
请确保/public/test文件夹下的js文件均是本文符合要求的测试脚本文件）

##脚本文件
###概述

>一个脚本文件是一个js文件，它必须定义_cartman_test_data，其定义方式请参考脚本样例，根据脚本元素定义；

>_cartman_test_data 为固定名称，它是一个数组，数组内是组（请参考脚本元素——组），其中的每一个元素表示一组测试；

>每个组中都有自己的urls数组，里面包含该组的url；每个url有自己的cases，可包含多个case，是对同一个url配备不同的参数和预期结果。

###脚本元素
组
<br>
<table>
    <tr>
        <td>属性名称</td>
        <td>类型</td>
        <td>描述</td>
        <td>备注</td>
    </tr>
    <tr>
        <td>name</td>
        <td>字符串</td>
        <td>组名</td>
        <td>必须、唯一</td>
    </tr>
    <tr>
        <td>dependencies</td>
        <td>数组，数组内为其他组名</td>
        <td>依赖</td>
        <td>可为空数组</td>
    </tr>
    <tr>
        <td>urls</td>
        <td>数组，数组内为url</td>
        <td>url</td>
        <td>必须</td>
    </tr>
</table>

url
<br>
<table>
    <tr>
        <td>属性名称</td>
        <td>类型</td>
        <td>描述</td>
        <td>备注</td>
    </tr>
    <tr>
        <td>name</td>
        <td>字符串</td>
        <td>url名称</td>
        <td>必须、组内唯一</td>
    </tr>
    <tr>
        <td>dependencies</td>
        <td>数组，数组内为其他url名称</td>
        <td>依赖</td>
        <td>若无依赖可为空数组</td>
    </tr>
    <tr>
        <td>path</td>
        <td>字符串</td>
        <td>请求路径</td>
        <td>必须</td>
    </tr>
    <tr>
        <td>method</td>
        <td>字符串</td>
        <td>请求方式</td>
        <td>必须</td>
    </tr>
    <tr>
        <td>authorities</td>
        <td>数组，数组内为json对象</td>
        <td>授权</td>
        <td>可选,将作为请求的附加参数</td>
    </tr>
    <tr>
        <td>cases</td>
        <td>数组，数组内为case</td>
        <td>case</td>
        <td>必须</td>
    </tr>
</table>

case
<br>
<table>
    <tr>
        <td>属性名称</td>
        <td>类型</td>
        <td>描述</td>
        <td>备注</td>
    </tr>
    <tr>
        <td>params</td>
        <td>json对象</td>
        <td>请求参数</td>
        <td>发送请求时将携带的参数</td>
    </tr>
    <tr>
        <td>description</td>
        <td>字符串</td>
        <td>对该case的描述</td>
        <td>若无依赖可为空数组</td>
    </tr>
    <tr>
        <td>expectation</td>
        <td>任意</td>
        <td>期待的结果</td>
        <td>用于和返回结果比较</td>
    </tr>
    <tr>
        <td>result</td>
        <td>任意</td>
        <td>请求结果</td>
        <td>用于请求返回时保存结果，脚本文件时请留空</td>
    </tr>
</table>


###脚本执行注意事项
1. 执行脚本文件时，按脚本顺序由上往下依次执行，每次执行一个case,当执行的case有返回结果时才会执行下一个。

2. 当一个case的返回结果和expectation完全一致时，该case执行成功，否则失败。

3. 只有当一个url下的所有case均执行成功时，该url才表示成功；否则显示失败。

4. 只有当一个组下的所有url均成功时，该组才表示成功；否则根据是否存在失败，显示失败或默认。

5. 依赖,组的依赖必须是组；url的依赖必须是同一个组内的其他url。

6. 当一个组/url的依赖存在不成功的组/url时，该组/url将不被执行。

7. /cartman_test_file被用于请求脚本文件，请避免使用该请求路径。

8. 请将写好的脚本文件放在，/public/test文件夹下，该文件夹专门用于存放脚本文件，若无需要可删除其他文件。

###脚本样例

<pre><code>
var _cartman_test_authorizes ={
    username : 'lcf',
    date :'2014-12-10'
}

var _cartman_test_data = [
    {
        name: "BC",
        dependencies: [],
        urls: [
            {
                "name": "url1",
                "dependencies": [],
                "path": "/mathB/docInfo",
                "authorities":[_cartman_test_authorizes],
                "method": "PUT",
                "cases": [
                    {
                        "params": {"docInfo": {
                            "contact": "我",
                            "description": "",
                            "license": "",
                            "licenseUrl": "",
                            "termsOfServiceUrl": "",
                            "title": ""
                        }},
                        "description": "我",
                        "expectation": {
                            "contact": "我",
                            "description": "",
                            "license": "",
                            "licenseUrl": "",
                            "termsOfServiceUrl": "",
                            "title": ""
                        },
                        "result": ""
                    },
                    {
                        "params": {"docInfo": {
                            "contact": "我的",
                            "description": "",
                            "license": "",
                            "licenseUrl": "",
                            "termsOfServiceUrl": "",
                            "title": ""
                        }},
                        "description": "我的",
                        "expectation": {
                            "contact": "我的",
                            "description": "",
                            "license": "",
                            "licenseUrl": "",
                            "termsOfServiceUrl": "",
                            "title": ""
                        },
                        "result": ""
                    }
                ]
            },
            {
                "name": "url2",
                "dependencies": [],
                "path": "/mathB/testChinese",
                "method": "POST",
                "cases": [
                    {
                        "params": {
                            "str" : "中文测试"
                        },
                        "description": "中文测试",
                        "expectation": "中文测试",
                        "result": ""
                    },
                    {
                        "params": {
                            "str" : "222中文测试"
                        },
                        "description": "222中文测试",
                        "expectation": "222中文测试",
                        "result": ""
                    }
                ]
            },
            {
                "name": "url3",
                "dependencies": ["url2"],
                "authorities":[_cartman_test_authorizes],
                "path": "/mathB/testChinese",
                "method": "GET",
                "cases": [
                    {
                        "params": {
                            "str" : "中文测试"
                        },
                        "description": "中文测试",
                        "expectation": "中文测试",
                        "result": ""
                    },
                    {
                        "params": {
                            "str" : "222中文测试"
                        },
                        "description": "222中文测试",
                        "expectation": "222中文测试",
                        "result": ""
                    }
                ]
            },
        ]
    }
]
</code></pre>

