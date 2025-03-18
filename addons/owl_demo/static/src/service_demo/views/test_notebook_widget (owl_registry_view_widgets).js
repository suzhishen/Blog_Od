/** @odoo-module **/

import {registry} from "@web/core/registry";
import {useService} from "@web/core/utils/hooks";

const {Component, onWillStart, useState, onWillUpdateProps, onRendered} = owl;
import {ConfirmationDialog} from "@web/core/confirmation_dialog/confirmation_dialog";

export class TestNotebookWidgetShowTree extends Component {
    setup() {
        this.ormService = useService("orm");
        this.actionService = useService("action");
        this.notification = useService('notification');
        this.dialog = useService('dialog');
        this.state = useState({
            orderRecord: {
                datas: []
            },
            chargeback_blank_order_datas: []
        })

        onRendered(() => {
            var checkExist = setInterval(function () {
                if ($('#main')) {
                    // 清除定时器
                    clearInterval(checkExist);
                    var chartDom = document.getElementById('main');
                    var myChart = echarts.init(chartDom);
                    var option;

                    option = {
                        xAxis: {
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [
                            {
                                data: [120, 200, 150, 80, 70, 110, 130],
                                type: 'bar'
                            }
                        ]
                    };

                    option && myChart.setOption(option);

                }
            }, 500); // 500毫秒检查一次
        });

        onWillStart(async () => {
        })

        onWillUpdateProps(async (nextProps) => {
        })
    }

    async orm_right_dialog_fun() {
        console.log('orm_right_dialog_fun 点击弹窗')
        this.dialog.add(ConfirmationDialog, {
            title: "dialog 弹窗",
            body: "这是一个 dialog 弹窗",
            confirm: async () => {
                // 确认执行的操作
                console.log('确认执行的操作')
            },
            cancel: () => {
                // 关闭执行的操作，不填则不操作并且关闭窗口
                console.log('关闭执行的操作，不填则不操作并且关闭窗口')
            },
        });
    }
}

TestNotebookWidgetShowTree.template = 'owl_demo.test_notebook_widget_tree'
registry.category("view_widgets").add("test_notebook_widget_tree", TestNotebookWidgetShowTree);