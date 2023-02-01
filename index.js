const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_tracker_db"
});

const viewDepartments = () => {
    db.query("SELECT * FROM department", function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
};

const viewEmployees = () => {
    db.query("SELECT * FROM employee", function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
};

const viewRoles = () => {
    db.query("SELECT * FROM role", function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
};

function prompt() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "action",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                    "Exit"
                ]
            }
        ])
        .then(function (response) {
            switch (response.action) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    db.end();
                    console.log("Goodbye!");
                    break;
            }
            if(response.action !== "Exit"){
                prompt()
            }
        })
}