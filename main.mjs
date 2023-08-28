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
            choices: ['View Departments', 'View Employee', 'Add Department', 'Add Employee', 'Exit']
        },
    ]).then((answers) => {
        switch (answers.action) {
            case 'View Departments':
                viewDepartments();
                break;
            case 'View Employee': 
                viewEmployee();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Exit':
                connection.end();
                console.log('Disconnected from MySQL');
                return;
        }
    });
};

const viewEmployee = () => {
    connection.query('SELECT * FROM users', (err, results) => {
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
        connection.query('INSERT INTO departments (name) VALUES (?)', [answers.name], (err, result) => {
            if (err) throw err;
            console.log('Added department: ${answer.name}');
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
            message: 'Select the employee role:',
            choices: ['Role A', 'Role B', 'Role C'],
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Enter the employee manager:',
            choices: ['Manager A', 'Manager B', 'Manager C'],
        },
    ]).then((answers) => {
        connection.query('INSERT INTO users (first_name, last_name) VALUES (?, ?)', [answers.first_name, answers.last_name], (err, results) => {
            if (err) throw err;
            console.log('Added user: ${answer.first_name}, ${answer.last_name}');
            startApp();
        });
    });
};
startApp();
