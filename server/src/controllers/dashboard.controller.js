const DashboardService = require("../services/dashboard.service");

class DashboardController {
    static async getDashboardStats(req, res) {
        const data = await DashboardService.getStats(); 
        res.status(201).json({ success: true, data  });
    }
}

module.exports = DashboardController;
