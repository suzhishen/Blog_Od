# -*- coding: utf-8 -*-

from typing import Annotated, Any, List
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from odoo import api, fields, models
from odoo.api import Environment



class Blogs(models.Model):
    _name = "blogs"
    _description = "FastAPI Endpoint"

    name = fields.Char(string='名称')
    age = fields.Integer(string='年龄')
    user = fields.Many2one('res.users', string='用户')