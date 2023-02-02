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

const addDepartment = async () => {
    const res = await inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "What is the name of the department you would like to add?",
                            name: "departmentName"
                        }
                    ]);
    await db.promise().query("INSERT INTO department (department_name) VALUES (?);", res.departmentName);
    return "Department added successfully!";
};

const addRole = async () => {
    const res = await inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "What is the title of the role you would like to add?",
                            name: "roleTitle"
                        },
                        {
                            type: "input",
                            message: "What is the salary of the role you would like to add?",
                            name: "roleSalary"
                        },
                        {
                            type: "input",
                            message: "What is the department id of the role you would like to add?",
                            name: "roleDepartmentId"
                        }
                    ]);
    await db.promise().query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);", [res.roleTitle, res.roleSalary, res.roleDepartmentId]);
    return "Role added successfully!";
};

const addEmployee = async () => {
    const res = await inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "What is the first name of the employee you would like to add?",
                            name: "employeeFirstName"
                        },
                        {
                            type: "input",
                            message: "What is the last name of the employee you would like to add?",
                            name: "employeeLastName"
                        },
                        {
                            type: "input",
                            message: "What is the role id of the employee you would like to add?",
                            name: "employeeRoleId"
                        },
                        {
                            type: "input",
                            message: "What is the manager id of the employee you would like to add?",
                            name: "employeeManagerId"
                        }
                    ]);
    await db.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [res.employeeFirstName, res.employeeLastName, res.employeeRoleId, res.employeeManagerId]);
    return "Employee added successfully!";
};

const updateEmployeeRole = async () => {
    const res = await inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "What is the id of the employee you would like to update?",
                            name: "employeeId"
                        },
                        {
                            type: "input",
                            message: "What is the new role id of the employee you would like to update?",
                            name: "employeeRoleId"
                        }
                    ]);
    await db.promise().query("UPDATE employee SET role_id = ? WHERE employee_id = ?;", [res.employeeRoleId, res.employeeId]);
    return "Employee updated successfully!";
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
        if(typeof results === "object"){
            printTable(results);
        } else {
            console.log(results);
        }
        prompt();
    }                 
}

//TODO: Add functionality to display list for adding and updating existing db fields

prompt();

