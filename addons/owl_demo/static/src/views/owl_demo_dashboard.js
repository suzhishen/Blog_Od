/** @odoo-module */

import {useService} from "@web/core/utils/hooks";
import {loadJS} from "@web/core/assets";
import {browser} from '@web/core/browser/browser';

import {ConfirmationDialog} from "@web/core/confirmation_dialog/confirmation_dialog";
import Dialog from 'web.Dialog';
import {qweb} from "web.core";

const {Component, useExternalListener, useRef, onRendered, onWillUpdateProps, onMounted, useState} = owl;
const {createEditor, createToolbar} = window.wangEditor

export class OwlDemoDashBoard extends Component {
    setup() {
        this.orm = useService("orm");
        this.user = useService("user");
        this.notification = useService("notification");
        this.action = useService("action");
        this.dialog = useService('dialog');
        this.state = useState({
            selects: [],
            data: [],
        })
        this.inputref = useRef('xxx_name')
        this.main_ref = useRef('mainRef')
        this.list = ''
        this.name1ID = 0
        this.xm_select_multi
        this.xm_select_single
        this.timeoutId
        this.rpc = useService("rpc");
        // this.Aaa = ()=>{
        //     layui.use('form', function () {
        //         layui.form.render();
        //     })
        // }
        //
        // useExternalListener(document.body, "click", this.Aaa);

        this.initChart = () => {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '柱形图测试'
                },
                tooltip: {},
                legend: {
                    data: ['销量']
                },
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子', '袜子1']
                },
                yAxis: {},
                series: [
                    {
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20, 21]
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }

        onMounted(() => {
            console.log('onMounted')
            console.log(this.state.selects)
            console.log($('#selectId'))

            $(document).ready(() => {
                $('#name1ID').on('input', (e) => this.click_select(e));
            });
            let self = this
            this.xm_select_multi = xmSelect.render({
                el: '#selectDemo',
                checkbox: true,
                repeat: false,
                autoRow: true,
                filterable: true,
                prop: {name: 'name1', value: 'id',},
                height: '200px',
                tips: '请选择',
                tree: {
                    show: true,
                    showFolderIcon: true,
                    showLine: true,
                    indent: 20,
                    expandedKeys: [-3],
                    strict: false,
                },
                data: [],
                remoteSearch: true,
                remoteMethod: function (val, cb, show) {    // 远程搜索方法，可以是后端接口，也可以是模型方法
                    let params = {'name1': val}
                    self.orm.call('owl.demo', 'get_update_xm_select_data', [params]).then(response => {
                        console.log(response)
                        var res = response;
                        cb(res)
                    }).catch(err => {
                        cb([]);
                    });
                },
                on: function (data) {
                    var arr = data.arr; //arr:  当前多选已选中的数据
                    console.log(data)
                },
                show() {
                    console.log('打开了')
                },
                hide() {
                    console.log('关闭了, 关闭重新更新数据')
                }
            });

            this.xm_select_single = xmSelect.render({
                el: '#demo3',
                radio: true,
                clickClose: true,
                filterable: true,
                prop: {name: 'name1', value: 'id',},
                height: '200px',
                theme: {
                    color: '#1e9fff',
                },
                data: [],
                remoteSearch: true,
                remoteMethod: function (val, cb, show) {    // 远程搜索方法，可以是后端接口，也可以是模型方法
                    let params = {'name1': val}
                    self.orm.call('owl.demo', 'get_update_xm_select_data', [params]).then(response => {
                        console.log(response)
                        var res = response;
                        cb(res)
                    }).catch(err => {
                        cb([]);
                    });
                },
                show() {
                    console.log('打开了')
                },
                hide() {
                    console.log('关闭了, 关闭重新更新数据')
                }
            });

            // 富文本编辑器
            const editorConfig = {
                placeholder: 'Type here...',
                onChange(editor) {
                    const html = editor.getHtml()
                    console.log('editor content', html)
                    // 也可以同步到 <textarea>
                }
            }
            const editor = createEditor({
                selector: '#editor-container',
                html: '<p><br></p>',
                config: editorConfig,
                mode: 'default', // or 'simple'
            })
            const toolbarConfig = {}
            const toolbar = createToolbar({
                editor,
                selector: '#toolbar-container',
                config: toolbarConfig,
                mode: 'default', // or 'simple'
            })
        })

        onWillUpdateProps(() => {
            console.log('onWillUpdateProps')
        })

        onRendered(() => {
            // loadJS("/owl_demo/static/src/js/layui.js");
            var checkExist = setInterval(function () {
                if ($('#main')) {
                    // 清除定时器
                    clearInterval(checkExist);

                    // this.initChart();    // 不能直接获取 this.initChart

                    // // 模拟点击事件
                    // var element = document.getElementById('monidianji');
                    // element.click()

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
    }


    async orm_fun() {
        console.log('orm_click 创建记录，orm 测试，看 log')
        console.log(this.inputref)
        console.log(this.inputref.el.value)
        console.log('-------------------')
        console.log(this.main_ref)
        var data = await this.orm.search('owl.demo', [["id", ">", 0]])
        if (!this.inputref.el.value) {
            return this.notification.add('创建值不能为空', {title: 'name1不能为空', type: 'danger'})
        }
        await this.orm.create('owl.demo', [{
            name1: this.inputref.el.value + '1',
            name2: this.inputref.el.value + '2',
            name3: this.inputref.el.value + '3'
        }]).then(() => {
            this.inputref.el.value = ''
            this.env.model.load();
        })
        var data1 = await this.orm.search('owl.demo', [["id", ">", 0]])
        console.log(data)
        console.log('--------------')
        console.log(data1)
    }

    async orm_left_fun() {
        console.log('orm_left_click 搜索')
        // var record = await this.orm.webSearchRead('owl.demo', [['name1', '=', this.select_ref.el.value]], ['name1', 'name2', 'name3'], {})
        var domain = []
        var value = $("#name1ID .layui-input")[0].value
        value !== '请选择' ? domain.push(['name1', 'ilike', value]) : []

        var searchParams = {
            "comparison": null,
            "context": this.user.context,
            // "domain": ["&",["name1", "ilike", ""], ["name2", "ilike", "测试"]],
            "domain": domain,
            "groupBy": [],
            "orderBy": [],
        }
        return await this.env.model.load(searchParams)
    }

    async orm_middle_fun() {
        console.log('orm_middle_click 测试图表')
        this.initChart()
    }

    async orm_right_doAction_fun() {
        console.log('orm_right_doAction_fun 点击弹窗')
        this.action.doAction({
            type: 'ir.actions.act_window',
            name: 'doAction 弹窗',
            res_model: 'owl.demo',
            // res_id: 38,    // (可选) -- 当默认的视图类型是form时，可用于指定加载的数据, 不指定则新建
            views: [[false, 'form']],
            view_model: 'form',
            target: 'new',
            context: {
                'default_name': '默认 context'
            }
        }, {
            onClose: async () => {
                this.env.model.load()
            }
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

    async orm_right_Dialog_fun2() {
        console.log('orm_right_Dialog_fun2 点击弹窗')
        let datas = '我是一个自定义str数据, 后期可以根据接口得到数据，自定义布局，用qweb进行渲染即可'
        new Dialog(this, {
            size: 'medium',
            title: '测试 Dialog',
            buttons: [
                {
                    classes: 'btn-secondary float-end',
                    close: true,
                    text: '关闭',
                }],
            $content: $(qweb.render('owl_demo.qweb_dialog_template', {
                datas: datas
            }))
        }).open();
    }


    async orm_right_Dialog_fun11() {
        console.log('orm_right_Dialog_fun11 点击弹窗')
        let datas = '我是一个自定义str数据, 后期可以根据接口得到数据，自定义布局，用qweb进行渲染即可'
        let $content = $(qweb.render('owl_demo.qweb_dialog_template11', {
                datas: datas
            }))
        let dialog = new Dialog(this, {
            size: 'medium',
            title: '测试 Dialog',
            buttons: [
                {
                    text: "确认",
                    classes: 'btn-primary',
                    close: true,
                    click: this.confirmCallback11($content),    // 可传参 如 $content
                },
                {
                    classes: 'btn-secondary float-end',
                    close: true,
                    text: '关闭',
                }],
            $content: $content
        // }).open();
        })
        dialog.opened().then(function () {
            // 点击按钮进入方法
            $content.on('click', '#test_id', function () {
                console.log('点击了测试点击事件')
            });
        })
        dialog.open();
    }

    confirmCallback11(e) {
        console.log(e)
        console.log('orm_right_Dialog_fun11 方法，测试 Dialog11 确认执行的操作')
    }


    async orm_right_Dialog_fun3() {
        console.log('orm_right_Dialog_fun3 点击弹窗')
        let datas = '我是一个自定义str数据, 后期可以根据接口得到数据，自定义布局，用qweb进行渲染即可3'
        new Dialog(this, {
            size: 'medium',
            title: '测试 Dialog3',
            buttons: [
                {
                    text: "确认",
                    classes: 'btn-primary',
                    close: true,
                    click: this.confirmCallback,
                },
                {
                    text: "取消",
                    close: true
                },],
            $content: $('<div>', {
                text: datas,
                style: 'overflow-wrap: break-word; color:red;'
            }),
        }).open();
    }

    confirmCallback() {
        console.log('orm_right_Dialog_fun3 方法，测试 Dialog3 确认执行的操作')
    }

    async click_select(e) {
        console.log(e);
        console.log('click_select 下拉');
        let self = this
        $(e.target).removeAttr('readonly')
        $(e.target).off('input').on('input', async (event) => {
            console.log('输入框输入, 延迟1秒搜索');
            clearTimeout(this.timeoutId)
            this.timeoutId = setTimeout(async () => {
                push_select_data(event)
                console.log('延迟1秒完成')
            }, 1000)
        })
        if (e.type === 'click') {
            push_select_data(e)
        }

        async function push_select_data(e) {
            let data = {}
            if (e.target.value) {
                data[['name1']] = e.target.value
            }
            self.state.selects = await self.orm.call('owl.demo', 'orm_select', [data])  // 跳转到 owl.demo 的 orm_select 方法，注意不是 api
            $(e.target).removeAttr('readonly')
            console.log(self.name1ID)
            if ($("#name1ID .layui-this")[0] !== undefined) {
                self.name1ID = Number($("#name1ID .layui-this")[0].attributes['lay-value'].value)
            }
            if (self.state.selects) {
                console.log($("#name1ID .layui-this"))
                $("#name1ID .new_add").remove();
                self.list = ''
                for (var i = 0; i < self.state.selects.length; i++) {
                    self.name1ID === self.state.selects[i].id ?
                        self.list += `<dd lay-value='${self.state.selects[i].id}' class='new_add layui-this'>${self.state.selects[i].name1}</dd>` :
                        self.list += `<dd lay-value='${self.state.selects[i].id}' class='new_add'>${self.state.selects[i].name1}</dd>`
                }
            } else {
                $("#name1ID .new_add").remove();
            }
            if (self.list) {
                // $("#name1ID .layui-select-tips").after(self.list)
                $("#name1ID .layui-anim").append(self.list)
            }
        }

        // let data = {}
        // if (e.target.value) {
        //     data[['name1']] = e.target.value
        // }
        // this.state.selects = await this.orm.call('owl.demo', 'orm_select', [data])
        // $(e.target).removeAttr('readonly')
        //
        // console.log(this.name1ID)
        // if ($("#name1ID .layui-this")[0] !== undefined) {
        //     this.name1ID = Number($("#name1ID .layui-this")[0].attributes['lay-value'].value)
        // }
        // if (this.state.selects) {
        //     console.log($("#name1ID .layui-this"))
        //     $("#name1ID .new_add").remove();
        //     this.list = ''
        //     for (var i = 0; i < this.state.selects.length; i++) {
        //         this.name1ID === this.state.selects[i].id ?
        //             this.list += `<dd lay-value='${this.state.selects[i].id}' class='new_add layui-this'>${this.state.selects[i].name1}</dd>` :
        //             this.list += `<dd lay-value='${this.state.selects[i].id}' class='new_add'>${this.state.selects[i].name1}</dd>`
        //     }
        // } else {
        //     $("#name1ID .new_add").remove();
        // }
        // if (this.list) {
        //     // $("#name1ID .layui-select-tips").after(this.list)
        //     $("#name1ID .layui-anim").append(this.list)
        // }
    }


    // async update_xm_select_data(current_this, selects = []) {
    //     console.log('update_xm_select_data')
    //     console.log(current_this)
    //     await this.orm.call('owl.demo', 'get_update_xm_select_data', []).then(data => {
    //         current_this.update({
    //             data: data
    //         })
    //     })
    // }

    async get_input_search_data(e) {
        var data = {}
        if (e.target.value) {
            data[['name1']] = e.target.value
        }
        this.state.selects = await this.orm.call('owl.demo', 'orm_select', [data])
        return this.state.selects.map(function (item) {
            return {
                id: item.id,
                title: item.name1
            };
        });
    }

    async click_input_select(e) {
        console.log(e);
        console.log('click_input_select 下拉');
        // 【该组件经过改进适合用于接口请求搜索数据】下拉菜单
        let self = this
        let dropdown = layui.dropdown;
        let data
        if (!dropdown.index) {
            data = await this.get_input_search_data(e)
        }
        let now_dropdown = dropdown.render({
                elem: '#input_search_data',     // 改
                id: 'input_search_data',
                data: data,
                show: true, // 重载即显示组件面板
                click: function (obj, othis) {
                    this.elem.val(obj.title);
                    dropdown.reloadData(now_dropdown.config.id, {
                        data: [], //
                    });
                },
                style: `height: 300px; overflow: auto; scrollbar-width: thin; min-width:${e.target.clientWidth.toString()}px`  // 可设置 style
            },
        );
        dropdown.open('input_search_data');  // 打开id对应面板
        // 监听点击输入框和输入事件时更新数据
        $(now_dropdown.config.elem).one('click', async function (e) {
            dropdown.reloadData(now_dropdown.config.id, {
                data: await self.get_input_search_data(e), // 匹配到的新数据
            });
        });
        let timeoutId;
        // document.getElementById('input_search_data').addEventListener('input', async (e) => {
        $(now_dropdown.config.elem).off('input').on('input', async (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                dropdown.reloadData(now_dropdown.config.id, {
                    data: await self.get_input_search_data(e), // 匹配到的新数据
                });
                console.log('延迟1秒')
            }, 1000); // 设置一个延迟时间，比如300毫秒
        });
        // $(now_dropdown.config.elem).off('input').on('input', async (e) => {
        //     clearTimeout(timeoutId);
        //     timeoutId = setTimeout(async () => {
        //         dropdown.reloadData(now_dropdown.config.id, {
        //             data: await self.get_input_search_data(e), // 匹配到的新数据
        //         });
        //         console.log('延迟1秒')
        //     }, 1000); // 设置一个延迟时间，比如300毫秒
        // });
    }
}

OwlDemoDashBoard
    .template = 'owl_demo.OwlDemoDashBoard'
