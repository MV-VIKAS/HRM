// router level middleware

// const express = require("express").Router();
//or
const { Router } = require("express");
const router = Router();
const multer = require("multer");
const EMPLOYEE_SCHEMA = require("../Model/Employees");

// load multer middleware
let { customStorage } = require("../middleware/multer");
const res = require("express/lib/response");
const upload = multer({ storage: customStorage });

/* @ HTTP GET METHOD
   @ACCESS PUBLIC
   @URL  employee/home
    */
router.get("/home", async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.find({}).lean();
  res.render("../views/home", { title: "Home Page", payload });
});

/* @ HTTP GET METHOD
   @ACCESS PUBLIC
   @URL  employee/create-emp
    */
router.get("/create-emp", (req, res) => {
  res.render("../views/employees/create-emp", { title: "create employee" });
});

/*@ HTTP GET METHOD
   @ACCESS PUBLIC
   @URL  employee/emp-profile
    */
router.get("/:id", async (req, res) => {
  let payload = await EMPLOYEE_SCHEMA.findOne({ _id: req.params.id }).lean()
  res.render("../views/employees/employeeProfile", { payload });
  console.log(payload);
});


/*@ HTTP GET METHOD
   @ACCESS PRIVATE
   @URL  employee/edit-emp
    */

router.get("/edit-emp/:id", async (req, res) => {
  let editPayload = await EMPLOYEE_SCHEMA.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/editEmp", { editPayload });
});
/* =================END ALL GET METHOD ========================*/

// router.get("/:id")

/* @ HTTP POST METHOD
   @ACCESS PUBLIC
   @URL  employee/create-emp
   to send data to database
    */
router.post("/create-emp", upload.single("emp_photo"), async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  // res.send("ok");
  let {
    emp_id,
    emp_name,
    emp_salary,
    emp_edu,
    emp_exp,
    emp_location,
    emp_des,
    emp_email,
    emp_phone,
    emp_skills,
    emp_gender,
  } = req.body;

  let payload = {
    emp_photo: req.file,
    emp_id,
    emp_name,
    emp_salary,
    emp_edu,
    emp_exp,
    emp_location,
    emp_des,
    emp_email,
    emp_phone,
    emp_skills,
    emp_gender,
  };
  // let payload = {
  //   emp_photo: req.file,
  //   emp_id: req.body.emp_id,
  //   emp_name: req.body.emp_name,
  //   emp_salary: req.body.emp_salary,
  //   emp_edu: req.body.emp_edu,
  //   emp_gender: req.body.emp_gender,
  //   emp_exp: req.body.emp_exp,
  //   emp_des: req.body.emp_des,
  //   emp_location: req.body.emp_location,
  //   emp_email: req.body.emp_email,
  //   emp_phone: req.body.emp_phone,
  //   emp_skills: req.body.emp_skills,
  // };
  //    body = await new EMPLOYEE_SCHEMA.create(payload);

  console.log(payload);
  // await EMPLOYEE()
  let body = await EMPLOYEE_SCHEMA.create(payload);
  req.flash("SUCCESS_MESSAGE","Successfully employee created")
  res.redirect("/employee/home", 302, {});
  // await new EMPLOYEE_SCHEMA(payload).save();
});
/* =================END ALL GET METHOD ========================*/
/* put request start her------------------*/

router.put("/edit-emp/:id", upload.single("emp_photo"), (req, res) => {
  EMPLOYEE_SCHEMA.findOne({ _id: req.params.id }).then(editEmp => {
    (editEmp.emp_photo = req.file),
      (editEmp.emp_id = req.body.emp_id),
      (editEmp.emp_name = req.body.emp_name),
      (editEmp.emp_salary = req.body.emp_salary),
      (editEmp.emp_des = req.body.emp_des),
      (editEmp.emp_exp = req.body.emp_exp),
      (editEmp.emp_edu = req.body.emp_edu),
      (editEmp.emp_email = req.body.emp_email),
      (editEmp.emp_skills = req.body.emp_skills),
      (editEmp.emp_phone = req.body.emp_phone),
      (editEmp.emp_gender = req.body.emp_gender),
      (editEmp.emp_location = req.body.emp_location),
      //update data in database
      editEmp.save().then(_ => {
            req.flash("SUCCESS_MESSAGE", "Successfully employee edited");
        res.redirect("/employee/home", 302, {});
    
      });
  }).catch(err => {
    req.flash("ERROR_MESSAGE", "sorry  employee not edited");
    console.log(err)
  });
 
});

router.delete("/delete-emp/:id", async (req, res) => {
  await EMPLOYEE_SCHEMA.deleteOne({ _id: req.params.id });
    req.flash("SUCCESS_MESSAGE", "Successfully employee deleted");
  res.redirect("/employee/home", 302, {});
});

/* put request end her------------------*/
module.exports = router;
