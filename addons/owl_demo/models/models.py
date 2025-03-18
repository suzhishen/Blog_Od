# -*- coding: utf-8 -*-
from odoo import api, models, fields


class OwlDemo(models.Model):       # --
    _name = 'owl.demo'              # --
    _rec_name = 'name1'             # --
    _description = 'test model'     # --
    _inherit = ['mail.thread', 'mail.activity.mixin',]

    name1 = fields.Char('测试字段1', required=True)
    name2 = fields.Char('测试字段2', required=True)
    name3 = fields.Char('测试字段3', required=True)
    notebook_ids = fields.One2many('owl.demo_notebook_widget', 'demo_id', string='测试 notebook widget')

    @api.model
    def orm_select(self, args=False):
        domain = []
        if args:
            name1 = args.get('name1', False)
            if name1:
                domain.append(('name1', 'ilike', name1))
        # records = self.env['owl.demo'].search([], limit=10)
        records = self.env['owl.demo'].search(domain)
        # return records.mapped('name1')
        print('123')
        return records.jsonify(['id', 'name1'])

    @api.model
    def get_update_xm_select_data(self, args=False):
        domain = []
        if args:
            name1 = args.get('name1', False)
            if name1:
                domain.append(('name1', 'ilike', name1))
        # records = self.env['owl.demo'].search([], limit=10)
        records = self.env['owl.demo'].search(domain)
        # return records.mapped('name1')
        print('获取下拉数据')
        get_records = records.jsonify(['id', 'name1'])
        return get_records


class OwlDemoNotebook(models.Model):       # --
    _name = 'owl.demo_notebook_widget'              # --
    _rec_name = 'name'             # --
    _description = 'test notebook widget'     # --

    name = fields.Char('notebook测试字段', required=True)
    demo_id = fields.Many2one('owl.demo', string='所属demo')


class ResUsersExtension(models.Model):
    _inherit = ['res.users', ]

    message_position = fields.Char(string='消息区位置', default='auto', help='bottom 代表下边显示【 this.ui.size <= 5 】，auto 代表自动位置【 不需要赋值this.ui.size 】')
