/** @odoo-module **/

import { registry } from "@web/core/registry";
import { listView } from "@web/views/list/list_view";
import { ListRenderer } from "@web/views/list/list_renderer";
import { OwlDemoDashBoard } from '@owl_demo/views/owl_demo_dashboard';

// 【 导入按钮 button_demo ↓ 】
import { ButtonTreeDashBoard } from '@owl_demo/button_demo/button_tree_dashboard';   // 导入模板直接使用
import { OwlDemoTestButton } from '@owl_demo/button_demo/button_tree_listview';      // 导入，如果 OwlDemoTestButton 里面显示的模板，则可以导入，如 import { ButtonTreeDashBoard }

export class OwlDemoRewriteListRenderer extends ListRenderer {}


export class OwlDemoRewriteTestButton extends OwlDemoTestButton {
    // 重写按钮点击方法
    async button_fun() {
        // super.button_fun();     // 调用父类方法，执行父类的方法，同时可以得到父类的 this
        console.log('------- 重写了该按钮的点击方法 -------');
        window.alert('重写了该按钮的点击方法！');
    }
}

// 【 导入按钮 button_demo ↓ 】
OwlDemoRewriteListRenderer.template = 'owl_demo.OwlDemoListView';
OwlDemoRewriteListRenderer.components = Object.assign({}, ListRenderer.components, { OwlDemoDashBoard, ButtonTreeDashBoard })     // 这里可以添加多个自定义组件，比如 OwlDemoDashBoard, ButtonTreeDashBoard, 记得要在 xml 加上 <OwlDemoDashBoard /> 和 <OwlDemoDashBoard />


console.log(OwlDemoRewriteListRenderer);
console.log(OwlDemoRewriteListRenderer.components);

export const OwlDemoRewriteDashBoardListView = {
    ...listView,
    Renderer: OwlDemoRewriteListRenderer,
    // 【 导入按钮 button_demo ↓ 】
    Controller: OwlDemoRewriteTestButton,      // 重写的按钮控制器    // 直接导入方法可以直接使用，不需要再次注册
    buttonTemplate: "OwlDemoButtons",   // 按钮 xml 模板, 也就是 t-name   // __manifest__.py 导入的 xml 模板可以直接使用
};

registry.category("views").add("owl_demo_rewrite_dashboard_list", OwlDemoRewriteDashBoardListView);    // owl_demo_dashboard_list 记得加到 js_class="owl_demo_dashboard_list"         registry.category("views") [包含 list, form, kanban 等]
