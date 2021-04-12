var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//middleware
const verifyToken = require("../middleware/verify-token");

//models
const Team = require("../models/team");


//buyer login
router.post("/team/login", async function (req, res) {
    try {
        const team = await Team.findOne({ teamCode: req.body.teamCode });

        if (!team) {
            res.status(400).json({
                message: "failed",
                additional_info: "invalid teamCode or password"
            });
        } else if (await bcrypt.compare(req.body.passKey, team.passKey)) {
            jwt.sign(
                { team_id: team._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1d" },
                (err, token) => {
                    if (err) {
                        res.status(403).json(err);
                    } else {
                        res.status(200).json({ token: token, team_id: team._id, teamName: team.teamName, teamWallet: team.teamWallet });
                    }
                }
            );
        } else {
            res.status(403).json({
                message: "failed",
                additional_info: "invalid teamCode or passkey"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

//buyer check auth
router.post("/team/check", verifyToken, function (req, res) {
    if (!req.auth) {
        res.status(403).json({ error: err });
    } else {
        res
            .status(200)
            .json({ message: "success", additional_info: "the authToken is valid" });
    }
});


module.exports = router;
