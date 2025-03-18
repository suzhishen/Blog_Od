/** @odoo-module **/

import {registry} from "@web/core/registry";
import {useBus, useService} from "@web/core/utils/hooks";

const {Component, onWillStart, useState, onWillUpdateProps, useEffect} = owl;
import {ConfirmationDialog} from "@web/core/confirmation_dialog/confirmation_dialog";
import Dialog from 'web.Dialog';

export class FastCuttingTaskBlankShowTree extends Component {
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

        onWillStart(async () => {
            this.state.orderRecord = await this.ormService.call(this.props.record.resModel, 'get_cutting_task_order_show_datas', [[this.props.record.resId]])
        })

        onWillUpdateProps(async (nextProps) => {
            if (nextProps.record.resId !== this.props.record.resId && nextProps.record.resId === false) {
                this.state.orderRecord = {
                    datas: []
                }
            }
            if ((nextProps.record.resId !== this.props.record.resId && nextProps.record.resId > 0) || nextProps.readonly === true) {
                this.state.orderRecord = await this.ormService.call(this.props.record.resModel, 'get_cutting_task_order_show_datas', [[nextProps.record.resId]])
            }
        })
    }

    _unlinkProductChargebackBlankOrderDatas(delete_id, key) {
        console.log(`删除${key}=${delete_id}的数据行，删除前的数据：`, this.state.chargeback_blank_order_datas);
        const chargeback_blank_order_datas = this.state.chargeback_blank_order_datas.filter(item => !(item[key] === delete_id));
        this.state.chargeback_blank_order_datas = chargeback_blank_order_datas;
        console.log(`删除${key}=${delete_id}的数据行，删除后的数据：`, this.state.chargeback_blank_order_datas);
    }

    _addProductChargebackBlankOrderDatas(productDatas) {
        console.log(`添加前的数据：`, this.state.chargeback_blank_order_datas);
        productDatas.forEach(data => {
            if (data.product_qty === 0) {
                this._unlinkProductChargebackBlankOrderDatas(data.product_id, 'product_id')
            } else {
                const existingIndex = this.state.chargeback_blank_order_datas.findIndex(item =>
                    item.product_id === data.product_id && item.product_tmpl_id === data.product_tmpl_id
                );
                if (existingIndex !== -1) {
                    this.state.chargeback_blank_order_datas[existingIndex] = data;
                } else {
                    this.state.chargeback_blank_order_datas.push(data);
                }
            }
        });
        console.log(`添加后的数据：`, this.state.chargeback_blank_order_datas);
    }

    selectProductColorCheck(product_configuration_datas, product_template_datas) {
        if (product_template_datas.select) {
            const allProductDatas = product_template_datas.product_datas.map(productData => ({
                ...productData,
                product_configuration_id: product_configuration_datas.origin_id,
                product_tmpl_id: product_template_datas.product_tmpl_id,
            }))
            this._addProductChargebackBlankOrderDatas(allProductDatas)
        } else {
            this._unlinkProductChargebackBlankOrderDatas(product_template_datas.product_tmpl_id, 'product_tmpl_id')
        }
    }

    selectConfigurationCheck(product_configuration_datas) {
        if (product_configuration_datas.select) {
            product_configuration_datas.product_template_datas.filter(ptd => ptd.select).forEach(data => {
                data.select = false;
                this._unlinkProductChargebackBlankOrderDatas(data.product_tmpl_id, 'product_tmpl_id')
            })
            const allProductDatas = product_configuration_datas.product_template_datas.reduce((acc, template) => {
                const productDatasWithIds = template.product_datas.map(productData => ({
                    ...productData,
                    product_configuration_id: product_configuration_datas.origin_id,
                    product_tmpl_id: template.product_tmpl_id,
                }));
                return acc.concat(productDatasWithIds);
            }, []);
            this._addProductChargebackBlankOrderDatas(allProductDatas)
        } else {
            this._unlinkProductChargebackBlankOrderDatas(product_configuration_datas.origin_id, 'product_configuration_id')
        }
    }

    addChargebackBlankOrderDatas(product_configuration_datas, product_template_datas) {
        product_template_datas.model = 'add-chargeback'
        product_configuration_datas.model = 'add-chargeback'
    }

    ClearChargebackBlankOrderDatas(product_configuration_datas, product_template_datas) {
        product_template_datas.model = ''
        let result = product_configuration_datas.product_template_datas.some(item => item.model === 'add-chargeback');
        if (!result) {
            product_configuration_datas.model = ''
        }
        this._unlinkProductChargebackBlankOrderDatas(product_template_datas.product_tmpl_id, 'product_tmpl_id')
    }

    onChangeChargebackValue(ev, product_configuration_datas, product_template_datas, product_datas) {
        let value = isNaN(parseInt(ev.target.value)) ? 0 : parseInt(ev.target.value)
        if (value > product_datas.product_qty) {
            this.notification.add(`本次填写数量【${value}】不能大于订单数量【${product_datas.product_qty}】`, {
                type: "danger",
            });
            value = 0
            ev.target.value = value
        }
        let new_product_datas = {...product_datas}
        new_product_datas.product_qty = value
        const allProductDatas = [{
            ...new_product_datas,
            product_configuration_id: product_configuration_datas.origin_id,
            product_tmpl_id: product_template_datas.product_tmpl_id,
        }]
        this._addProductChargebackBlankOrderDatas(allProductDatas)
    }

    async chargebackBlankOrderBtn() {
        this.dialog.add(ConfirmationDialog, {
            title: "退单提示",
            body: "确认将选择的数量退回到待分配吗？",
            confirm: async () => {
                let result = await this.ormService.call(this.props.record.resModel, 'btn_chargeback_blank_order_to_allocate', [[this.props.record.resId]], {
                    chargeback_blank_order_datas: this.state.chargeback_blank_order_datas
                })
                this.state.chargeback_blank_order_datas = []
                await this.props.record.model.load({'resId': this.props.record.resId});
                await this.props.record.model.notify()
            },
            cancel: () => {
            },
        });
    }
}

FastCuttingTaskBlankShowTree.template = 'fast_order_center.cutting_task_show_tree'
registry.category("view_widgets").add("fast_order_center_cutting_task_show_tree", FastCuttingTaskBlankShowTree);