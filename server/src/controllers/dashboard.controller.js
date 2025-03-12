const DashboardService = require("../services/dashboard.service");

class DashboardController {
    static async getDashboardStats(req, res) {
        const data = await DashboardService.getStats();
        res.json(data);
    }
}

module.exports = DashboardController;
