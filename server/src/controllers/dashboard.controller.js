const DashboardService = require("../services/dashboard.service");

class DashboardController {
    static async getDashboardStats(req, res) {
        const data = await DashboardService.getStats(); 
        res.status(201).json({ success: true, data  });
    }
    static async getNewUsers(req, res) {
        const users = await DashboardService.getNewUsers();
        res.status(200).json({ success: true, users });
    }

    static async getPotentialCustomers(req, res) {
        const users = await DashboardService.getPotentialCustomers();
        res.status(200).json({ success: true, users });
    }
}

module.exports = DashboardController;
