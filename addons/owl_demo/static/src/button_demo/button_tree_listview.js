/** @odoo-module **/

import { registry } from "@web/core/registry";
import { listView } from "@web/views/list/list_view";
import { ListRenderer } from "@web/views/list/list_renderer";
import { ListController } from "@web/views/list/list_controller";
import { useService } from "@web/core/utils/hooks";

import { ButtonTreeDashBoard } from '@owl_demo/button_demo/button_tree_dashboard';      // 改


export class OwlDemoTestListRenderer extends ListRenderer {}

export class OwlDemoTestButton extends ListController {
    setup() {
        this.test_data = '点击按钮测试数据'
        this.action = useService('action')
        super.setup();
    }

    async button_fun() {
        console.log("------- 点击测试 -------");
        console.log(this.test_data);
        // await this.orm.call('xxxx.model', 'button_plan')
        await this.action.doAction('owl_demo.action_owl_service_orm_service_client_2');
    }
}

OwlDemoTestListRenderer.template = 'owlDemo.OwlDemoTestListtView';
OwlDemoTestListRenderer.components = Object.assign({}, ListRenderer.components, {ButtonTreeDashBoard})

export const OwlDemoTestListtView = {
    ...listView,
    Renderer: OwlDemoTestListRenderer,
    Controller: OwlDemoTestButton,      // 按钮控制器
    buttonTemplate: "OwlDemoButtons",   // 按钮 xml 模板
};

registry.category("views").add("owl_demo_test_list", OwlDemoTestListtView);     // 注册
