/** @odoo-module */

import {registry} from "@web/core/registry"
const { useExternalListener } = owl

export const getPartnesService = {
    dependencies: ['orm'],  // 依赖于 orm 服务, 必须是 service 里定义的。如 useService("orm");
    async start(env, {orm}) {
        const data = await orm.searchRead('res.partner', [], ['image_128', 'name', 'website', 'phone'])
        return {data}
    }
}

export const layuiDemo2Service = {
    dependencies: ['orm'], // 依赖于 orm 服务, 必须是 service 里定义的。如 useService("orm");
    async start(env, {orm}) {
        const data = {
            "code": 0
            , "msg": ""
            , "count": 66
            , "data": [{
                "username": "张小三"
                , "amount": 18
                , "province": "浙江"
                , "city": "杭州"
                , "zone": "西湖区"
                , "street": "西溪街道"
                , "address": "西溪花园"
                , "house": "30栋1单元"
            }, {
                "username": "李小四"
                , "amount": 39
                , "province": "江苏"
                , "city": "苏州"
                , "zone": "姑苏区"
                , "street": "丝绸路"
                , "address": "天墅之城"
                , "house": "9幢2单元"
            }, {
                "username": "王小五"
                , "amount": 8
                , "province": "江西"
                , "city": "南昌"
                , "zone": "青山湖区"
                , "street": "艾溪湖办事处"
                , "address": "中兴和园"
                , "house": "1幢3单元"
            }, {
                "username": "赵小六"
                , "amount": 16
                , "province": "福建"
                , "city": "泉州"
                , "zone": "丰泽区"
                , "street": "南洋街道"
                , "address": "南洋村"
                , "house": "6幢1单元"
            }, {
                "username": "孙小七"
                , "amount": 12
                , "province": "湖北"
                , "city": "武汉"
                , "zone": "武昌区"
                , "street": "武昌大道"
                , "address": "两湖花园"
                , "house": "16幢2单元"
            }, {
                "username": "周小八"
                , "amount": 11
                , "province": "安徽"
                , "city": "黄山"
                , "zone": "黄山区"
                , "street": "汤口镇"
                , "address": "温泉村"
                , "house": "21号"
            }]
        }
        return data
    },
}

// 服务是一种长久运行的代码段，用于提供某种功能
registry.category("services").add("owl.getPartnesService", getPartnesService)
registry.category("services").add("owl.layuiDemo2Service", layuiDemo2Service)