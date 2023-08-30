import inquirer from 'inquirer';
import { connection } from './mysqlConnector.mjs';

const prompt = inquirer.createPromptModule();

// Start command-line app
const startApp = () => {
    prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Choose an action:',
            choices: ['View All Departments','View All Roles', 'View All Employee', 
            'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit']
        },
    ]).then((answers) => {
        switch (answers.action) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employee': 
                viewEmployee();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                console.log('Disconnected from MySQL');
                return;
        }
    });
};

const viewDepartments = () => {
    connection.query('SELECT * FROM department_new', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
};

const viewRoles = () => {
    connection.query('SELECT * FROM role_new', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
};

const viewEmployee = () => {
    connection.query('SELECT * FROM employee_new', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
};

const addDepartment = () => {
    prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter department name:',
        },
    ]).then((answers) => {
        connection.query('INSERT INTO department_new (name) VALUES (?)', [answers.name], (err, result) => {
            if (err) throw err;
            console.log('Added department: ${answer.name}');
            startApp();
        });
    });
};

const addRole = () => {
    const deptChoices = [
        { name: 'Finance', id: 1 },
        { name: 'HR', id: 2 },
        { name: 'Maintenance', id: 3 }
    ];
    prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter role name',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter salary',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department id:',
            choices: deptChoices.map(dept => dept.name), // Corrected this line
        },
    ]).then((answers) => {
        // Find the selected department's ID based on the selected name
        const selectedDepartment = deptChoices.find(dept => dept.name === answers.department_id);

        const values = [answers.title, answers.salary, selectedDepartment.id];

        connection.query('INSERT INTO role_new (title, salary, department_id) VALUES (?, ?, ?)', values, (err, results) => {
            if (err) throw err;
            console.log(`Added role: ${answers.title}`);
            startApp();
        });
    });
};


const addEmployee = () => {
    const roleChoices = [
        { name: 'Role A', id: 1 },
        { name: 'Role B', id: 2 },
        { name: 'Role C', id: 3 }
    ];

    const managerChoices = [
        { name: 'Peter', id: 1 },
        { name: 'Miguel', id: 2 },
        { name: 'Jose R', id: 3 }
    ];

    prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter employee first name',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter employee last name',
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the employee role:',
            choices: roleChoices.map(role => role.name),
        },
        {
            type: 'list',
            name: 'manager_name',
            message: 'Select the employee manager:',
            choices: managerChoices.map(manager => manager.name),
        },
    ]).then((answers) => {
        // Find the selected role's ID and manager's ID based on the selected names
        const selectedRole = roleChoices.find(role => role.name === answers.role_id);
        const selectedManager = managerChoices.find(manager => manager.name === answers.manager_name);

        const values = [answers.first_name, answers.last_name, selectedRole.id, selectedManager.id];

        connection.query('INSERT INTO employee_new (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', values, (err, results) => {
            if (err) throw err;
            console.log(`Added user: ${answers.first_name}, ${answers.last_name}`);
            startApp();
        });
    });
};



const updateEmployeeRole = () => {
    prompt([
        {
            type: 'input',
            name: 'employeeId', // Change to 'employeeId'
            message: 'Enter the ID of the employee whose role you want to update:',
        },
        {
            type: 'input',
            name: 'newRoleId',
            message: 'Enter the new role ID:',
        },
    ])
    .then((answers) => {
        const employeeId = parseInt(answers.employeeId);
        const newRoleId = parseInt(answers.newRoleId);

        const query = 'UPDATE employee_new SET employee_id = ? WHERE role_id = ?';

        connection.query(query, [newRoleId, employeeId], (err, results) => {
            if (err) {
                console.error('Error updating employee role:', err);
            } else {
                console.log(`Employee with ID ${employeeId} has been assigned a new role with ID ${newRoleId}.`); // Use backticks here
            }
            startApp();
        });
    });
};

startApp();
