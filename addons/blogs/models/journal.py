# -*- coding: utf-8 -*-

from odoo import api, fields, models


class BlogsJournal(models.Model):
    _name = "blogs.journal"
    _description = "博客日志内容"

    title = fields.Char(string="标题")
    author = fields.Char(string="作者")
    content = fields.Text(string="内容")
    html_content = fields.Html(string="Html 内容")
    menu_ids = fields.One2many("blogs.menu", 'journal_id', string="日志附属菜单")
