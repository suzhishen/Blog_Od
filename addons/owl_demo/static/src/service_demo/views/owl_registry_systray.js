/** @odoo-module */

import {registry} from "@web/core/registry"
import {useService} from "@web/core/utils/hooks"

const {Component, onMounted, onWillDestroy, useState} = owl

export class OwlDemoSystray extends Component {
    setup() {
        console.log("OwlDemoSystray setup")
        this.orm = useService("orm")
        this.user = useService("user")
        this.ui = useService("ui")
        this.view = useService("view");
        this.action = useService("action");
        this.MessagePosition = 'auto';
        this.timeoutId;
        this.info = {};
        this.onActionManagerOnchange = async ({detail: info}) => {
            console.log("-------- 切图视图 -----");
            if (this.user.context.uid) {
                await this.orm.searchRead('res.users', [['id', '=', this.user.context.uid]], ['message_position']).then((data) => {
                    if (data[0].message_position && this.user.context.uid) {
                        this.MessagePosition = data[0].message_position
                    }
                    console.log(`消息位置显示切换为${this.MessagePosition}`);
                })
            }
            console.log(this.MessagePosition);
            this.MessagePosition === 'bottom' ? this.ui.size = 5 : console.log('改为auto');

            if (info.componentProps.type === "form" || info.componentProps.type === undefined) {
                // 监听窗口大小变化
                $(window).on('resize', (e) => {
                    if (this.info.componentProps.type !== "form" || this.MessagePosition === 'auto') {
                        return
                    }
                    clearTimeout(this.timeoutId);
                    this.timeoutId = setTimeout(() => {
                        this.MessagePosition === 'bottom' ? console.log('窗口变化，下方显示') : console.log('窗口变化，自动显示');
                    }, 300)

                    // 监听 Class 变化, 变化之前修改， 不让变化【注：如果放到 setTimeout 中，第一次不会触发】
                    let onchange = false
                    let observer
                    let self = this;
                    if (self.ui.size > 5) {
                        try {
                            if ($('.o_view_controller .o_FormRenderer_chatterContainer').length <= 1) {
                                let target = document.querySelector('.o_view_controller');
                                let o_FormRenderer_chatterContainer = document.querySelector('.o_FormRenderer_chatterContainer')
                                target.appendChild(o_FormRenderer_chatterContainer);
                                $('.o_view_controller > .o_FormRenderer_chatterContainer').css('display', 'none');
                                console.log('insertAfter 插入之前 appendChild 了');
                            }

                            $('.o_form_editable .o_FormRenderer_chatterContainer').remove();
                            var o_FormRenderer_chatterContainer_copy = $('.o_view_controller .o_FormRenderer_chatterContainer').clone();
                            o_FormRenderer_chatterContainer_copy.insertAfter($('.o_form_sheet_bg'));
                            $('.o_form_editable .o_FormRenderer_chatterContainer').css('display', 'flex');
                            console.log('insertAfter 复制插入了');
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    // 检查是否已经存在 MutationObserver
                    if (!observer) {
                        // 创建一个 MutationObserver 实例
                        observer = new MutationObserver(async (mutations) => {
                            if (self.MessagePosition === 'auto') {
                                return
                            }
                            await mutations.forEach(function (mutation) {
                                if ($('.o_FormRenderer_chatterContainer').length > 1) {
                                    $('.o_FormRenderer_chatterContainer')[0].remove()
                                }
                                if (mutation.attributeName === 'class' && !onchange && $('.o_FormRenderer_chatterContainer').length <= 1) {
                                    // 当 class 发生变化时执行的操作
                                    console.log('Class 变化了！');
                                    let target = document.querySelector('.o_view_controller');
                                    let o_form_editable = document.querySelector('.o_form_editable')
                                    let o_FormRenderer_chatterContainer = document.querySelector('.o_FormRenderer_chatterContainer')

                                    if (!onchange) {
                                        target.className = 'o_action o_view_controller o_form_view';
                                        o_form_editable.className = 'o_form_editable d-flex o_form_saved flex-column';
                                        o_FormRenderer_chatterContainer.className = 'o_FormRenderer_chatterContainer oe_chatter';
                                        o_form_editable.appendChild(o_FormRenderer_chatterContainer);
                                        onchange = true;
                                    }
                                }
                            })
                        });
                        let target = document.querySelector('.o_view_controller');
                        let config = {attributes: true, attributeFilter: ['class']};
                        observer.observe(target, config);
                    }
                });
                console.log("-------- 进入 form111 -----");
            }
            this.info = info;
            this.render();
        };

        this.env.bus.addEventListener("ACTION_MANAGER:UPDATE", this.onActionManagerOnchange);
        onWillDestroy(() => {
            console.log("onWillDestroy 在组件销毁之前应执行的代码的钩子")
            this.env.bus.removeEventListener("ACTION_MANAGER:UPDATE", this.onActionManagerOnchange);
        });

        onMounted(() => {
            console.log('onMounted 挂载组件时应执行的代码的钩子')
        })
    }

    switching_message_position() {
        console.log("OwlDemoSystray render")
        this.MessagePosition === 'auto' ? this.MessagePosition = 'bottom' : this.MessagePosition = 'auto';
        this.orm.write('res.users', [this.user.userId], {message_position: this.MessagePosition})
        location.reload();
    }
}

OwlDemoSystray.template = 'Owl.DemoSystray'

registry.category("systray").add("owl_demo_systray", {Component: OwlDemoSystray}, {sequence: 200})  // sequence 越小越靠右
