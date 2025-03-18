/** @odoo-module */

import {registry} from "@web/core/registry"
import {useService} from "@web/core/utils/hooks";
import {loadJS} from "@web/core/assets";
import {browser} from '@web/core/browser/browser';

const {Component, whenReady, useRef, onRendered, onWillUpdateProps, onMounted, useState} = owl;

export class OwlDemoService2 extends Component {
    setup() {
        this.orm = useService("orm");
        this.user = useService("user");
        this.notification = useService("notification");
        this.action = useService("action");
        this.state = useState({
            selects: [],
            data: [],
            layuiDemo2Service: useService('owl.layuiDemo2Service'),
        })
        this.inputref = useRef('xxx_name')
        this.main_ref = useRef('mainRef')
        this.list = ''
        this.name1ID = 0
        this.timeoutId
        this.rpc = useService("rpc");
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
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [
                    {
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
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

                // // 所有资源加载完成后再执行，防止资源未加载完成时找不到元素
                // setInterval(() => {
                //     console.log('一直监听  setInterval')
                //     $('#test_table_div .layui-table-body tr').off('click').on('click', (e) => this.table_click_fun(e));
                // }, 0)
                // 所有资源加载完成后再执行，防止资源未加载完成时找不到元素
                setTimeout(() => {
                    console.log('只执行一次  setTimeout')
                    $(document).off('click', '#test_table_div .layui-table-body tr').on('click', '#test_table_div .layui-table-body tr', (e) => {
                        // 执行事件处理程序
                        this.table_click_fun(e);
                        e.currentTarget.click()
                    });
                }, 0)
            });
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

        whenReady(() => {
            console.log('whenReady    当 DOM 加载完成时再执行')
        })
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
        }]).then(async () => {
            this.inputref.el.value = ''
            this.notification.add('创建成功', {type: 'success'})
            // 数据重载 - 仅与数据相关的属性(options)能参与到重载中
            layui.table.reloadData('test_table', {
                url: '/get_table_data'
            });
        })
        var data1 = await this.orm.search('owl.demo', [["id", ">", 0]])
        console.log(data)
        console.log('--------------')
        console.log(data1)
    }

    async orm_left_fun() {
        console.log('orm_left_click 搜索')
        // var record = await this.orm.webSearchRead('owl.demo', [['name1', '=', this.select_ref.el.value]], ['name1', 'name2', 'name3'], {})
        let params = {}
        var value = $("#name1ID .layui-input")[0].value
        value !== '请选择' ? params[['name1']] = value : {}
        // 将 params 对象转换为 URL 查询字符串
        const searchParams = new URLSearchParams(params).toString();
        // 数据重载 - 仅与数据相关的属性(options)能参与到重载中
        layui.table.reloadData('test_table', {
            url: `/get_table_data?${searchParams}`
        });
    }

    async orm_middle_fun() {
        console.log('orm_middle_click 测试图表')
        this.initChart()
    }

    async orm_right_fun() {
        console.log('orm_right_fun 点击弹窗')
        this.action.doAction({
            type: 'ir.actions.act_window',
            name: '测试弹窗',
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
            self.state.selects = await self.orm.call('owl.demo', 'orm_select', [data])
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

    async table_click_fun(e) {
        console.log('table_click_fun 表格点击');
        var self = this
        // 数据重载 - 仅与数据相关的属性(options)能参与到重载中
        layui.table.on('row(test_table)', (obj) => {
            var data = obj.data; // 得到当前行数据
            console.log(data)
            self.action.doAction({
                type: 'ir.actions.act_window',
                name: '测试弹窗',
                res_model: 'owl.demo',
                res_id: data.id,
                views: [[false, 'form']],
                view_model: 'form',
                target: 'current',
            });
        });
    }
}

OwlDemoService2.template = 'Owl.OwlDemoService2'

registry.category("actions").add("owl_OrmService_2", OwlDemoService2)
