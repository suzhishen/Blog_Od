# Copyright 2023 ACSONE SA/NV
# License LGPL-3.0 or later (http://www.gnu.org/licenses/LGPL).
"""
The demo router is a router that demonstrates how to use the fastapi
integration with odoo.
"""
from typing import Annotated

from odoo.http import request
from odoo.addons.fastapi.dependencies import odoo_env
from odoo.api import Environment
import random

import logging
_logger = logging.getLogger(__name__)

from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter()

search_map = {
    'name': {
        'field': 'name',
        'op': 'ilike',
    },
}

form_fields = [
    'id',
    'name',
    'title',
    'path',
    'icon',
    'url',
    'href',
    ('child_ids', ['id', 'name', 'tag_name', 'path', 'icon', 'url', 'href']),
]

list_fields = [
    'id',
    'name',
    'title',
    'path',
    'icon',
    'url',
    'href',
    ('child_ids', ['id', 'name', 'title', 'path', 'icon', 'url', 'href']),
]

create_fields = [
    'id',
    'name',
    'title',
    'path',
    'icon',
    'url',
    'href',
    'child_ids'
]

write_fields = create_fields



@router.get("/menu")
async def search(env: Annotated[Environment, Depends(odoo_env)]):
    domain = [('parent_id', '=', False)]
    rows = env["blogs.menu"].sudo().search_count(domain)
    record = env["blogs.menu"].sudo().search(domain)
    return {
        'code': 200,
        'rows': rows,
        'message': 'success',
        'data': await _to_list(record)
    }


@router.get("/menu/{id}")
async def get(id: str):
    return {
        'code': 200,
        'message': '表单',
    }


@router.post("/menu")
async def create(env: Annotated[Environment, Depends(odoo_env)]):
    form_data = await _get_form_data()
    if not set(create_fields) >= set(form_data.keys()):
        return {
            'code': 403,
            'message': '表单字段出现非允许修改的字段:' + ','.join(set(form_data.keys()) - set(create_fields))
        }
    record = await _create(form_data)
    return {
        'code': 200,
        'message': '创建成功',
        'data': await _to_form(record)
    }


@router.post("/create_friend")
async def create_friend(env: Annotated[Environment, Depends(odoo_env)]):
    """ 友链申请 """
    form_data = await _get_form_data()
    title = form_data.get('title', False)
    if title:
        menu_record = env["blogs.menu"].sudo().search([('title', '=', title)])
        if menu_record:
            # return {'code': 400, 'message': '已存在同名友链，请更换！'}
          raise HTTPException(status.HTTP_400_BAD_REQUEST, "已存在同名友链，请更换！")
    if not set(create_fields) >= set(form_data.keys()):
        return {
            'code': 403,
            'message': '表单字段出现非允许修改的字段:' + ','.join(set(form_data.keys()) - set(create_fields))
        }

    menu_id = env["blogs.menu"].sudo().search([('title', '=', '友链'), ('parent_id', '=', False)]).id
    form_data.update({
        'stage_id': 1,
        'parent_id':menu_id
    })
    record = await _create(form_data)
    return {
        'code': 200,
        'message': '创建成功',
        'data': await _to_form(record)
    }


@router.put("/menu/{id}")
async def write(id: str):
    return {
        'code': 200,
        'message': '修改表单',
    }


@router.delete("/menu/{id}")
async def delete(id: str):
    return {
        'code': 200,
        'message': '删除表单',
    }


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


async def _get_form_data():
    form_data = request.httprequest.form.to_dict()
    for k, v in form_data.items():
        if v.isdigit():
            form_data[k] = int(v)
        elif all([s.isdigit() for s in v.split('.')]):
            form_data[k] = float(v)
        elif v in ['null','undefined','false']:
            form_data[k] = False
        elif v.startswith('[[') and v.endswith(']]'):
            form_data[k] = eval(v)
    return form_data


async def _get(self, _id):
    return self.env['blogs.menu'].browse(_id)


async def _search(self, domain=[], page=1, limit=40, sort=''):
    offset = (page - 1) * limit
    if offset < 0:
        offset = 0
    return self.env['blogs.menu'].sudo().search(domain, offset=offset, limit=limit, order=sort)


async def _create(form_data):
    res = request.env['blogs.menu'].sudo().create([form_data])
    return res


async def _to_form(records):
    res = records.jsonify(form_fields)
    return res


async def _to_list(records):
    res = records.sudo().jsonify(list_fields)
    return res
