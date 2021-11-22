const Order = require('../../../models/order')

function statusController() {
    return {
        update(req, res) {
            Order.updateOne({ _id: req.body.orderId }, { status: req.body.status }, (err, data) => {
                if (err) {
                    return res.redirect('/admin/orders')
                }
                // Emit event  at socket when chance status
                const eventEmitter = req.app.get('eventEmitter')//requiest emmitor from app.js
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
                return res.redirect('/admin/orders')
            })
        }
    }
}

module.exports = statusController
