# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import content_disposition, dispatch_rpc, request,route
# from odoo.addons.base_rest.controllers import main
import json


# class PartnerApiController(http.RestController):
#     '''
#     测试数据API
#     '''
#     _root_path = '/test_api/'
#     _collection_name = 'test.services'
#     _cors = False
#     _csrf = False
#     _default_auth = 'user'
