# -*- coding: utf-8 -*-
{
    'name': "blogs",

    'summary': """
        博客项目""",

    'description': """
        博客项目模块
    """,

    'author': "zhishen",
    'website': "http://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/16.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',
    'license': 'LGPL-3',

    # any module necessary for this one to work correctly
    'depends': ['base',
                "fastapi"],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        # 'views/views.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
}
