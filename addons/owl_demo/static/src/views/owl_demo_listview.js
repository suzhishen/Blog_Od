/** @odoo-module **/

import { registry } from "@web/core/registry";
import { listView } from "@web/views/list/list_view";
import { ListRenderer } from "@web/views/list/list_renderer";
import { OwlDemoDashBoard } from '@owl_demo/views/owl_demo_dashboard';

// 【 导入按钮 button_demo ↓ 】
// import { ButtonTreeDashBoard } from '@owl_demo/button_demo/button_tree_dashboard';   // 导入模板直接使用
// import { OwlDemoTestButton } from '@owl_demo/button_demo/button_tree_listview';      // 导入，如果 OwlDemoTestButton 里面显示的模板，则可以导入，如 import { ButtonTreeDashBoard }

export class OwlDemoDashBoardListRenderer extends ListRenderer {
    onValueChange(event) {
        console.log(event);
    }
}

// 【 导入按钮 button_demo ↓ 】
// OwlDemoDashBoardListRenderer.template = 'owl_demo.OwlDemoListView';
// OwlDemoDashBoardListRenderer.components = Object.assign({}, ListRenderer.components, { OwlDemoDashBoard, ButtonTreeDashBoard })     // 这里可以添加多个自定义组件，比如 OwlDemoDashBoard, ButtonTreeDashBoard, 记得要在 xml 加上 <OwlDemoDashBoard /> 和 <OwlDemoDashBoard />

OwlDemoDashBoardListRenderer.template = 'owl_demo.OwlDemoListView';
OwlDemoDashBoardListRenderer.components = Object.assign({}, ListRenderer.components, { OwlDemoDashBoard })  // 记得要在 xml 加上 <OwlDemoDashBoard />
//相当于上面的两行【 报错了，后续研究？ 】
// OwlDemoDashBoardListRenderer = Object.assign({}, ListRenderer, {
//     template: 'owl_demo.OwlDemoListView',
//     components: { OwlDemoDashBoard }
// })
console.log(OwlDemoDashBoardListRenderer);
console.log(OwlDemoDashBoardListRenderer.components);

export const OwlDemoDashBoardListView = {
    ...listView,
    Renderer: OwlDemoDashBoardListRenderer,
    // 【 导入按钮 button_demo ↓ 】
    // Controller: OwlDemoTestButton,      // 按钮控制器    // 直接导入方法可以直接使用，不需要再次注册
    // buttonTemplate: "OwlDemoButtons",   // 按钮 xml 模板, 也就是 t-name   // __manifest__.py 导入的 xml 模板可以直接使用
};

registry.category("views").add("owl_demo_dashboard_list", OwlDemoDashBoardListView);    // owl_demo_dashboard_list 记得加到 js_class="owl_demo_dashboard_list"         registry.category("views") [包含 list, form, kanban 等]
