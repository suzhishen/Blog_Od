// /** @odoo-module */
//
// import {ActionContainer} from '@web/webclient/actions/action_container';
// import {patch} from "@web/core/utils/patch";
//
// import {Component, onWillDestroy} from "@odoo/owl";
//
// const testCx = {
//     setup() {
//         this._super(...arguments);
//         this.info = {};
//         this.onActionManagerUpdate = ({detail: info}) => {
//             console.log("-------- 进入 Action -----");
//             if (info.componentProps.type === "form") {
//                 console.log("-------- 进入 form -----");
//             }
//             this.info = info;
//             this.render();
//         };
//         this.env.bus.addEventListener("ACTION_MANAGER:UPDATE", this.onActionManagerUpdate);
//         onWillDestroy(() => {
//             this.env.bus.removeEventListener("ACTION_MANAGER:UPDATE", this.onActionManagerUpdate);
//         });
//     }
// };
//
// patch(ActionContainer.prototype, 'testCx', testCx);