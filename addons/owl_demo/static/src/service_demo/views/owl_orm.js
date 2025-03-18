/** @odoo-module */

import { registry } from "@web/core/registry"
import { useService } from "@web/core/utils/hooks"

const { Component, useState } = owl

export class OwlOrmService extends Component {
    setup() {
        this.orm = useService("orm")
        this.state = useState({
            partners: [],
            partners_service: useService('owl.getPartnesService')    // 调用服务，进入页面就获取数据，不需要点击按钮
        })
    }

    async getOrmService() {
        console.log('ORM Button')
        const data = await this.orm.searchRead('res.partner', [], ['image_128', 'name', 'website', 'phone'])
        this.state.partners = data
        // this.state.partners = {'data': data}
    }
}

OwlOrmService.template = 'Owl.OrmService'

registry.category("actions").add("owl_OrmService", OwlOrmService)
