var express = require("express");
var router = express.Router();
var Employee = require("../app/models/employee");
var mfa = require("node-2fa");
var jwt = require("jsonwebtoken");
var admin = require("firebase-admin");
var serviceAccount = require("." + process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});
router.route("/")
    .get(function(req, res) {
      if (req.body) {
        var email = req.body.email;
      } else {
        var email = null;
      }
        res.render("signin", {email: email});
    });
router.route("/signin-challenge")
    .post(function (req, res) {
        Employee.findOne({ email: req.body.email }, function (err, employee) {
            if (employee) {
                employee.comparePassword(req.body.password, function(err, isMatch) {
                    if (err) console.log(err);
                    if (isMatch) {
                        if (employee.mfa) {
                            res.render("mfa", { mfatoken: jwt.sign({data: employee._id}, process.env.MFA_KEY, { expiresIn: "5m" }) });
                        } else if (employee.mfa === false) {
                            admin.auth().createCustomToken(employee._id, {type: "Employee"})
                              .then(function(token) {
                                res.render("console", { token: token });
                              })
                              .catch(function(error) {
                                console.log("Error creating custom token:", error);
                              });
                        } else {
                            var mfaSecret = mfa.generateSecret({name: 'Laser Quest', account: req.body.email});
                            res.render("mfasetup", { mfatoken: jwt.sign({data: {id: employee._id, mfasecret: mfaSecret}}, process.env.MFA_KEY, { expiresIn: "1h" }), mfasecret: mfaSecret, delta: 0 });
                        }
                    } else {
                      res.render("signin", {email: req.body.email, password: false});
                    }
                });
            } else {
                res.render("signin", {email: false});
            }
        });
    });
router.route("/mfa-challenge")
    .post(function (req, res) {
        jwt.verify(req.body.mfatoken, process.env.MFA_KEY, function (err, employee_id) {
          if (err) console.log(err);
          Employee.findById(employee_id.data, function (err, employee) {
            if (err) console.log(err);
            isValidCode = mfa.verifyToken(employee.mfa, req.body.code);
            if (isValidCode) {
                if (isValidCode.delta === 0) {
                  admin.auth().createCustomToken(employee_id.data, {type: "Employee"})
                    .then(function(token) {
                      res.render("console", { token: token });
                    })
                    .catch(function(error) {
                      console.log("Error creating custom token:", error);
                    });
                } else {
                  res.render("mfasetup", {mfasecret: employee.mfa, delta: isValidCode.delta});
                }
            } else {
              res.render("mfasetup", {mfasecret: employee.mfa, delta: null});
            }
          });
        });
    });
  router.route("/mfa-setup-challenge")
      .post(function (req, res) {
          jwt.verify(req.body.mfatoken, process.env.MFA_KEY, function (err, employee_id) {
            if (err) console.log(err);
            console.log(employee_id.data.mfasecret);
            console.log(employee_id.data.mfasecret.secret);
            console.log(req.body.mfasecret);
            isValidCode = mfa.verifyToken(employee_id.data.mfasecret.secret, req.body.code);
            if (isValidCode) {
                if (isValidCode.delta === 0) {
                  Employee.findById(employee_id.data.id, function (err, employee) {
                    if (err) console.log(err);
                    employee.mfa = employee_id.data.mfasecret.secret;
                    employee.save(function (err) {
                      admin.auth().createCustomToken(employee_id.data.id, {type: "Employee"})
                        .then(function(token) {
                          res.render("console", { token: token });
                        })
                        .catch(function(error) {
                          console.log("Error creating custom token:", error);
                        });
                    });
                  });
                } else {
                  res.render("mfasetup", {mfatoken: jwt.sign({data: {id: employee_id.data.id, mfasecret: employee_id.data.mfasecret}}, process.env.MFA_KEY, { expiresIn: "1h" }), mfasecret: employee_id.data.mfasecret, delta: isValidCode.delta});
                }
            } else {
              res.render("mfasetup", {mfatoken: jwt.sign({data: {id: employee_id.data.id, mfasecret: employee_id.data.mfasecret}}, process.env.MFA_KEY, { expiresIn: "1h" }), mfasecret: employee_id.data.mfasecret, delta: null});
            }
          });
      });
  router.route("/nophone")
      .get(function (req, res) {
          jwt.verify(req.body.mfatoken, process.env.MFA_KEY, function (err, employee_id) {
            if (err) console.log(err);
            Employee.findById(employee_id.data, function (err, emp) {
              if (err) console.log(err);
              employee.mfa = false;
              employee.save(function (err) {
                if (err) console.log(err);
                admin.auth().createCustomToken(employee_id.data, {type: "Employee"})
                  .then(function(token) {
                    res.render("console", { token: token });
                  })
                  .catch(function(error) {
                    console.log("Error creating custom token:", error);
                  });
              });
            });
          });
      });
module.exports = router;
