# -*- coding: utf-8 -*-
from typing import List
from fastapi import APIRouter

from odoo import api, fields, models

"""
配置路由根路径 API
"""
# 路由定义的py文件路径
from odoo.addons.fastapi.routers import demo, demo_doc
from odoo.addons.blogs.routers import demo1, menu, encouragement, journal   # 添加


class FastapiEndpoint(models.Model):
    _inherit = "fastapi.endpoint"

    # app: str = fields.Selection(
    #     selection_add=[("blogs", "blogs")], ondelete={"demo1": "cascade", "blogs": "cascade"}
    # )

    @api.model
    def select_filter(self):
        return ([
            ("fastapi_endpoint_demo", "Fastapi Endpoint Demo"),     # 可以当做一个 model 的定义
            ("blogs", "Blogs")      # 可以当做一个 model 的定义    # 修改
        ])

    app: str = fields.Selection(selection='select_filter',
                                ondelete={
                                    "fastapi_endpoint_demo": "cascade",
                                    "blogs": "cascade"
                                })

    def _get_fastapi_routers(self) -> List[APIRouter]:
        if self.app == "fastapi_endpoint_demo":     # 可以当做一个 model 的定义
            return [demo]   # 导入的文件夹
        if self.app == "blogs":     # 可以当做一个 model 的定义
            return [demo1, menu, encouragement, journal]   # 导入的文件夹【多个】    # 修改
        return super()._get_fastapi_routers()

