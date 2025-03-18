# -*- coding: utf-8 -*-

from odoo import api, fields, models


class BlogsMenu(models.Model):
    _name = "blogs.menu"
    _description = "博客菜单"

    title = fields.Char(string='路由标题', help="用于显示的列表名称")
    name = fields.Char(string='路由名称')
    path = fields.Char(string='路由跳转路径')
    icon = fields.Char(string='图标', help="需要在 vue 引入 @element-plus/icons-vue")
    url = fields.Char(string='路由跳转路径')
    parent_id = fields.Many2one('blogs.menu', string='父菜单')
    child_ids = fields.One2many('blogs.menu', 'parent_id', string='子菜单')
    journal_id = fields.Many2one('blogs.journal', string='日志')
    href = fields.Char(string='跳转链接')
    stage_id = fields.Many2one('blogs.menu_stage', string='状态')


class BlogsMenuStage(models.Model):
    _name = "blogs.menu_stage"
    _description = "博客菜单状态"

    name = fields.Char(string='名称')
