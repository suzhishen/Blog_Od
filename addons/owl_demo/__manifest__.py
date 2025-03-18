# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

# name: 模块的名称，在Odoo应用商店或模块列表中显示
# version: 模块的版本，遵循语义版本控制
# category: 模块的分类，帮助在Odoo应用商店中组织和搜索模块
# sequence: 控制模块的显示顺序。数字越小，显示越靠前
# summary: 模块的简短描述，通常在模块列表或应用商店中显示
# description: 模块的详细描述，可以使用HTML标签格式化
# website: 模块的官方网站或文档页面
# depends: 模块的依赖列表，这个模块依赖的其他模块名称
# data: 包含模块数据文件的列表，这些文件通常用于配置安全规则、视图、数据等。例如，'security/crm_security.xml' 定义了模块的安全规则。
# demo: 包含模块演示数据的文件列表。这些数据仅在安装演示数据时使用，有助于了解模块的功能。例如，'data/crm_lead_demo.xml' 提供了演示用的潜在客户数据。
# css: 包含模块使用的CSS文件的列表。这里是['static/src/css/crm.css']，定义了CRM模块特有的样式。
# installable: 指示模块是否可以安装。这里设置为True，表示模块可以安装。
# application: 指示模块是否为应用程序。设置为True时，模块将在Odoo的应用列表中显示为一个独立应用。这里设置为True。
# auto_install: 指示模块是否应该在满足所有依赖关系时自动安装。这里设置为False，表示模块不会自动安装。

{
    'name': 'Owl Demo',  # 改 ↓
    'version': '1.1',
    'license': 'LGPL-3',
    'category': 'owl/Owl Demo',
    'sequence': 15,
    'summary': '模块的简短描述',
    'description': "",
    'website': 'https://www.odoo.com',
    'depends': [
        'base',
        'mail',
    ],
    'data': [
        'security/ir.model.access.csv',
        'views/views.xml',
        'views/owl_service_views.xml',
        'views/qweb_pdf.xml',
        'views/qweb_pdf_template.xml',
        'views/menu.xml',
    ],
    'demo': [
        # 'data/demo.xml',
    ],
    'assets': {
        'web.assets_common': [       # 全局范围加载的资源包
            'owl_demo/static/src/css/*.css',
            'owl_demo/static/src/service_demo/views/*.css',     # 改 owl_demo
        ],
        'web.assets_backend': [    # 后台管理界面用的资源包
            'owl_demo/static/src/views/*.js',   # 改 owl_demo
            'owl_demo/static/src/services/*.js',     # 改 owl_demo
            'owl_demo/static/src/js/*.js',  # 改 owl_demo
            'owl_demo/static/src/**/*.xml',  # 改 owl_demo

            'owl_demo/static/src/service_demo/**/*.js',     # 改 owl_demo
            'owl_demo/static/src/service_demo/**/*.xml',     # 改 owl_demo
            'owl_demo/static/src/button_demo/**/*.js',     # 改 owl_demo
            'owl_demo/static/src/button_demo/**/*.xml',     # 改 owl_demo
        ],
        'web.assets_frontend': [    # 前端网站用的资源包 如：js 组件资源
        ],

    },
    'installable': True,
    'application': True,
    'auto_install': False
}
