
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
                "method": "POST",
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
            {
                "name": "url4",
                "dependencies": [],
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
            }
        ]
    },
    {
        name: "BB",
        dependencies: [],
        urls: [
            {
                "name": "url1",
                "dependencies": [],
                "path": "/mathB/sum",
                "method": "POST",
                "type": "query",
                "params": ["a", "b"],
                "cases": [
                    {
                        "params": {
                            a: 1,
                            b: 2
                        },
                        "description": "1+2",
                        "expectation": 3,
                        "result": ""
                    }
                ]
            },
            {
                "name": "url2",
                "dependencies": [],
                "path": "/mathB/sum",
                "method": "POST",
                "type": "query",
                "params": ["a", "b"],
                "cases": [
                    {
                        "params": {
                            a: 1,
                            b: 2
                        },
                        "description": "1+2",
                        "expectation": 3,
                        "result": ""
                    },
                    {
                        "params": {
                            a: 0,
                            b: 2
                        },
                        "description": "0+2",
                        "expectation": 2,
                        "result": ""
                    },
                    {
                        "params": {
                            a: -1,
                            b: 2
                        },
                        "description": "-1+2",
                        "expectation": 1,
                        "result": ""
                    }
                ]},
            {
                "name": "url3",
                "dependencies": ["url2"],
                "path": "/mathB/test",
                "method": "POST",
                "type": "query",
                "cases": [
                    {
                        "params": {
                            a: 1,
                            b: 2
                        },
                        "description": "1/2",
                        "expectation": 0.5,
                        "result": ""
                    },
                    {
                        "params": {
                            a: 0,
                            b: 2
                        },
                        "description": "0/2",
                        "expectation": 0,
                        "result": "" }
                ]
            },
            {
                "name": "url4",
                "dependencies": ["url1"],
                "path": "/mathB/max",
                "method": "POST",
                "type": "query",
                "cases": [
                    {
                        "params": {
                            a: 1,
                            b: 2
                        },
                        "description": "max(1,2)",
                        "expectation": 2,
                        "result": ""
                    },
                    {
                        "params": {
                            a: 0,
                            b: 2
                        },
                        "description": "max(0,2)",
                        "expectation": 2,
                        "result": "" }
                ]
            }
        ]
    },
    {
        name: "BA",
        dependencies: [],
        urls: [
            {
                "name": "url1",
                "dependencies": [],
                "path": "/mathB/sum",
                "method": "POST",
                "authorities":[_cartman_test_authorizes],
                "type": "query",
                "params": ["a", "b"],
                "cases": [
                    {
                        "params": {
                            a: 1,
                            b: 2
                        },
                        "description": "1+2",
                        "expectation": 3,
                        "result": ""
                    }
                ]
            },
            {
                "name": "url2",
                "dependencies": [],
                "path": "/mathB/sum",
                "method": "POST",
                "type": "query",
                "params": ["a", "b"],
                "cases": [
                    {
                        "params": {
                            a: 1,
                            b: 2
                        },
                        "description": "1+2",
                        "expectation": 3,
                        "result": ""
                    },
                    {
                        "params": {
                            a: 0,
                            b: 2
                        },
                        "description": "0+2",
                        "expectation": 2,
                        "result": ""
                    },
                    {
                        "params": {
                            a: -1,
                            b: 2
                        },
                        "description": "-1+2",
                        "expectation": 1,
                        "result": ""
                    }
                ]},
            {
                "name": "url3",
                "dependencies": [],
                "path": "/mathB/test",
                "method": "POST",
                "type": "query",
                "cases": [
                    {
                        "params": {
                            a: 1,
                            b: 2
                        },
                        "description": "1/2",
                        "expectation": 0.5,
                        "result": ""
                    },
                    {
                        "params": {
                            a: 0,
                            b: 2
                        },
                        "description": "0/2",
                        "expectation": 0,
                        "result": "" }
                ]
            },
            {
                "name": "url4",
                "dependencies": ["url1"],
                "path": "/mathB/max",
                "method": "POST",
                "type": "query",
                "cases": [
                    {
                        "params": {
                            a: 1,
                            b: 2
                        },
                        "description": "max(1,2)",
                        "expectation": 2,
                        "result": ""
                    },
                    {
                        "params": {
                            a: 0,
                            b: 2
                        },
                        "description": "max(0,2)",
                        "expectation": 2,
                        "result": "" }
                ]
            }
        ]
    }
]