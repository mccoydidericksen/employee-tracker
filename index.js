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
    let availableDepartments = [];
    const results = await db.promise().query("SELECT department_id, department_name FROM department;");
    for (let i = 0; i < results[0].length; i++) {
        availableDepartments.push(results[0][i].department_id + " - " + results[0][i].department_name);
    };
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
                            type: "list",
                            message: "What is the department of the role you would like to add?",
                            name: "roleDepartmentId",
                            choices: availableDepartments
                        }
                    ]);
    await db.promise().query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);", [res.roleTitle, res.roleSalary, res.roleDepartmentId[0]]);
    return "Role added successfully!";
};

const addEmployee = async () => {
    let availableRoles = [];
    const role_results = await db.promise().query("SELECT role_id, title FROM roles;");
    for (let i = 0; i < role_results[0].length; i++) {
        availableRoles.push(role_results[0][i].role_id + " - " + role_results[0][i].title);
    };
    
    let availableManagers = [];
    const manager_results = await db.promise().query("SELECT employee_id, first_name, last_name FROM employee WHERE manager_id IS NULL;");
    for (let i = 0; i < manager_results[0].length; i++) {
        availableManagers.push(manager_results[0][i].employee_id + " - " + manager_results[0][i].first_name + " " + manager_results[0][i].last_name);
    };
    availableManagers.push("No Manager");
    
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
                            type: "list",
                            message: "What is the role of the employee you would like to add?",
                            name: "employeeRoleId",
                            choices: availableRoles
                        },
                        {
                            type: "list",
                            message: "What is the manager of the employee you would like to add?",
                            name: "employeeManagerId",
                            choices: availableManagers
                        }
                    ]);
    if (res.employeeManagerId === "No Manager") {
        res.employeeManagerId = null;
        await db.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [res.employeeFirstName, res.employeeLastName, res.employeeRoleId.substr(0, res.employeeRoleId.indexOf(" ")), res.employeeManagerId]);

    } else {
        await db.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [res.employeeFirstName, res.employeeLastName, res.employeeRoleId.substr(0, res.employeeRoleId.indexOf(" ")), res.employeeManagerId.substr(0, res.employeeManagerId.indexOf(" "))]);
    };
    return "Employee added successfully!";
};

const updateEmployeeRole = async () => {
    let availableEmployees = [];
    const employee_results = await db.promise().query("SELECT employee_id, first_name, last_name FROM employee;");
    for (let i = 0; i < employee_results[0].length; i++) {
        availableEmployees.push(employee_results[0][i].employee_id + " - " + employee_results[0][i].first_name + " " + employee_results[0][i].last_name);
    };
    let availableRoles = [];
    const role_results = await db.promise().query("SELECT role_id, title FROM roles;");
    for (let i = 0; i < role_results[0].length; i++) {
        availableRoles.push(role_results[0][i].role_id + " - " + role_results[0][i].title);
    };
    let availableManagers = [];
    const manager_results = await db.promise().query("SELECT employee_id, first_name, last_name FROM employee WHERE manager_id IS NULL;");
    for (let i = 0; i < manager_results[0].length; i++) {
        availableManagers.push(manager_results[0][i].employee_id + " - " + manager_results[0][i].first_name + " " + manager_results[0][i].last_name);
    };
    availableManagers.push("No Manager");
    const res = await inquirer
                    .prompt([
                        {
                            type: "list",
                            message: "Who is the employee you would like to update?",
                            name: "employeeId",
                            choices: availableEmployees
                        },
                        {
                            type: "list",
                            message: "What is the new role of the employee you would like to update?",
                            name: "employeeRoleId",
                            choices: availableRoles
                        },
                        {
                            type: "list",
                            message: "Who is the new manager of the employee you would like to update?",
                            name: "employeeManagerId",
                            choices: availableManagers
                        }
                    ]);
    // original.substr(original.indexOf(" ") + 1);
    if (res.employeeManagerId === "No Manager") {
        res.employeeManagerId = null;
        await db.promise().query("UPDATE employee SET role_id = ?, manager_id = ? WHERE employee_id = ?;", [res.employeeRoleId.substr(0, res.employeeRoleId.indexOf(" ")), res.employeeManagerId, res.employeeId.substr(0, res.employeeId.indexOf(" "))]);
    } else {
        await db.promise().query("UPDATE employee SET role_id = ?, manager_id = ? WHERE employee_id = ?;", [res.employeeRoleId.substr(0, res.employeeRoleId.indexOf(" ")), res.employeeManagerId.substr(0, res.employeeManagerId.indexOf(" ")), res.employeeId.substr(0, res.employeeId.indexOf(" "))]);
    }
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

prompt();

