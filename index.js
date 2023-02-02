const inquirer = require("inquirer");
const mysql = require("mysql2");
const { printTable } = require('console-table-printer');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_tracker_db"
});

const viewDepartments = async () => {
    const results = await db.promise().query("SELECT * FROM department;");
    return results[0];
};

const viewEmployees = async () => {
    const results = await db.promise().query("SELECT e.employee_id, e.first_name, e.last_name, r.title, d.department_name, CONCAT('$', FORMAT(r.salary, 2)) as salary, IFNULL(CONCAT(e2.first_name, ' ', e2.last_name), 'NULL') as manager_name FROM employee e JOIN roles r on r.role_id = e.role_id JOIN department d on d.department_id = r.department_id LEFT JOIN employee e2 on e2.employee_id = e.manager_id ORDER BY e.employee_id;");
    return results[0];
};

const viewRoles = async () => {
    const results = await db.promise().query("SELECT r.role_id, d.department_name, r.title, CONCAT('$', FORMAT(r.salary, 2)) as salary FROM roles r JOIN department d on d.department_id = r.department_id ORDER BY r.role_id;");
    return results[0];
};

const responseAction = async (res) => {
    let results;
    switch (res.action) {
        case "View all departments":
            results = await viewDepartments();
            break;
        case "View all roles":
            results = await viewRoles();
            break;
        case "View all employees":
            results = await viewEmployees();
            break;
        case "Add a department":
            results = await addDepartment();
            break;
        case "Add a role":
            results = await addRole();
            break;
        case "Add an employee":
            results = await addEmployee();
            break;
        case "Update an employee role":
            results = await updateEmployeeRole();
            break;
    };
    return results;
};

const prompt = async () => {
    const res = await inquirer
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
    if(res.action === "Exit") {
        db.end();
        console.log("Goodbye!");
        return;
    } else {
        let results = await responseAction(res);
        printTable(results);
        prompt();
    }                 
}

prompt();

