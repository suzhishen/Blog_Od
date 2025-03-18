# Copyright 2023 ACSONE SA/NV
# License LGPL-3.0 or later (http://www.gnu.org/licenses/LGPL).
"""
The demo router is a router that demonstrates how to use the fastapi
integration with odoo.
"""
from typing import Annotated

from odoo.api import Environment
from odoo.http import request
from odoo.exceptions import AccessError, MissingError, UserError, ValidationError


from fastapi import APIRouter, Depends, HTTPException, status

from odoo.addons.fastapi.dependencies import authenticated_partner, fastapi_endpoint, odoo_env
from odoo.addons.fastapi.models import FastapiEndpoint
from odoo.addons.fastapi.schemas import DemoEndpointAppInfo, DemoExceptionType, DemoUserInfo
from pydantic import BaseModel
import json

router = APIRouter()

class PartnerInfo(BaseModel):
    name: str
    email: str

@router.get("/1")
async def search():
    # form_data = request.httprequest.form.to_dict()
    # params = dict(request.httprequest.args)
    # params1 = request.get_http_params()
    # """Hello World!"""
    # # rows = request.env["res.partner"].sudo().search_count([])
    # # res = request.env["res.partner"].sudo().search([])
    # rows = request.env["res.partner"].sudo().search_count([])
    # res = request.env["res.partner"].sudo().search([])
    # data = await _get_data(res)
    return {
        'code': 200,
        'message': '列表',
    }


@router.get("/blogs1/{id}")
async def get(id: str):
    return {
        'code': 200,
        'message': '表单',
    }



# @router.get("/blogs/{id}")
# async def hello_word1(id: str):
#     form_data = request.httprequest.form.to_dict()
#     params = dict(request.httprequest.args)
#     params1 = request.get_http_params()
#     """Hello World!"""
#     # rows = request.env["res.partner"].sudo().search_count([])
#     # res = request.env["res.partner"].sudo().search([])
#     rows = request.env["res.partner"].sudo().search_count([])
#     res = request.env["res.partner"].sudo().search([])
#     data = await _get_data(res)
#     return {
#         'code': 200,
#         'message': 'success',
#         'rows': rows,
#         'data': data,
#     }
#     # return {"Hello": "get_blogs"}

@router.post("/blogs1")
async def hello_word():
    """Hello World!"""
    return {"Hello": "post_blogs"}

@router.put("/blogs1")
async def hello_word():
    """Hello World!"""
    return {"Hello": "put_blogs"}

@router.delete("/blogs1")
async def hello_word():
    """Hello World!"""
    return {"Hello": "delete_blogs"}


async def _domain_builder(self, params):
    domain = [('stage_id.name', '=', '已提交'), ('interior', '=', False)]
    for k, v in params.items():
        if k in self.search_map:
            if isinstance(self.search_map[k], dict):
                if self.search_map[k].get('split'):
                    params[k] = params[k].split(',')
                    op_list = ['|'] * (len(params[k]) - 1)
                    domain.extend(op_list)
                    for s in params[k]:
                        domain.append((self.search_map[k]['field'], self.search_map[k]['op'], s))
                else:
                    domain.append((self.search_map[k]['field'], self.search_map[k]['op'], params[k]))
            else:
                domain.append((self.search_map[k], '=', params[k]))
    return domain


async def _get(self, _id):
    return self.env['blogs'].browse(_id)


async def _get_data(records):
    return [
        PartnerInfo(name=partner.name, email=partner.email)
        for partner in records
    ]

    # data = []
    # for partner in records:
    #     data.append((PartnerInfo(name=partner.name, email=partner.email)))
    # return data