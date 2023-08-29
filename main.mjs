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
    connection.query('SELECT * FROM department_temp', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
};

const viewRoles = () => {
    connection.query('SELECT * FROM role_temp', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
};

const viewEmployee = () => {
    connection.query('SELECT * FROM employee_temp', (err, results) => {
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
        connection.query('INSERT INTO department_temp (name) VALUES (?)', [answers.name], (err, result) => {
            if (err) throw err;
            console.log('Added department: ${answer.name}');
            startApp();
        });
    });
};

const addRole = () => {
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
            choices: [1, 2, 3],
        },
    ]).then((answers) => {
        connection.query('INSERT INTO role_temp (title, salary, department_id) VALUES (?, ?, ?)', [answers.role_name, answers.salary, 
            answers.department_id], (err, results) => {
            if (err) throw err;
            console.log('Added user: ${answer.first_name}, ${answer.last_name}');
            startApp();
        });
    });
};

const addEmployee = () => {
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
            message: 'Select the role id:',
            choices: [1, 2, 3],
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Enter the employee manager:',
            choices: ['Manager A', 'Manager B', 'Manager C'],
        },
    ]).then((answers) => {
        connection.query('INSERT INTO employee_temp (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.first_name, 
            answers.last_name, answers.role_id, answers.manager_id], (err, results) => {
            if (err) throw err;
            console.log('Added user: ${answer.first_name}, ${answer.last_name}');
            startApp();
        });
    });
};

const updateEmployeeRole = () => {
    prompt([
        {
            type: 'input',
            name: 'newRoleId',
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

        const query = 'UPDATE employee_temp SET role_id = ? WHERE id = ?';

        connection.query(query, [newRoleId, employeeId], (err, results) => {
            if (err) {
                console.error('Error updating employee role:', err);
            } else {
                console.log('Employee with ID ${employeeId} has been assigned a new role with ID ${newRoleId}.');
            }
        })
    })
}
startApp();
