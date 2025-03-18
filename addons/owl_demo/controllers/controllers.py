# -*- coding: utf-8 -*-
import requests

from odoo import http
from odoo.http import request, serialize_exception
# from odoo import api, SUPERUSER_ID
import os
import json


class SapbotUpload(http.Controller):
    @http.route('/get_table_data', auth='user', type='http', csrf=False)
    def get_table_data(self, **kwargs):
        params = request.params
        limit = params.get('limit', 10)
        page = params.get('page', 1)
        domain = []
        name1 = params.get('name1', False)
        if name1:
            domain.append(('name1', 'ilike', name1))
        offset = (int(page) - 1) * int(limit)
        # records = self.env['owl.demo'].search([], limit=10)
        counts = request.env['owl.demo'].search_count(domain)
        records = request.env['owl.demo'].search(domain, limit=int(limit), offset=offset, order='id desc')
        # return records.mapped('name1')
        data = records.jsonify(['id', 'name1', 'name2', 'name3'])
        return json.dumps({
            "code": 0,
            "msg": "success",
            "count": counts,
            "data": data,
        })

    @http.route('/get_test_table_data', auth='user', type='http', csrf=False)
    def get_test_table_data(self, **kwargs):
        return json.dumps({
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
        })
