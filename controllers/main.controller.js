class MainController {
    async index(req, res) {
        res.send('Api bot de EmprenDev');
    }
}

module.exports = new MainController();