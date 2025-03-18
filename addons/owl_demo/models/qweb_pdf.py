from odoo import fields, models, api, _


# class TxProductionMergeOrder(models.AbstractModel):
#     _name = 'report.owl_demo.test_report_qweb_pdf'  # report.模块名+(Qweb模板)看板视图id
#     _description = '制造单打印'
#
#
# def _get_report_values(self, docids, data=None):
#     docs = self.env['mrp.production'].sudo().browse(docids)
#     return {
#         'docs': docs,
#     }




class OwlDemoExtend(models.Model):
    _inherit = 'owl.demo'

    # 测试打印报告
    def print_action_owl_demo_view_form_report(self):
        return self.env.ref('owl_demo.action_report_report_purchase_order_detail_origin').report_action(self, config=False)

