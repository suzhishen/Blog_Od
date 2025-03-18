/** @odoo-module */

import { useService } from "@web/core/utils/hooks";

const { Component, EventBus } = owl;

export class ButtonTreeDashBoard extends Component {
    setup() {
        this.orm = useService("orm");
        this.action = useService("action");

    }
}


ButtonTreeDashBoard.template = 'button.ButtonTreeDashBoard'
