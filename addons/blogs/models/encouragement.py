# -*- coding: utf-8 -*-

from odoo import api, fields, models


class BlogsEncouragement(models.Model):
    _name = "blogs.encouragement"
    _description = "励志语录"

    content = fields.Char(string='励志内容')
