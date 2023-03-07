const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "./team.html");

const render = require("./src/page-template.js");

const team = [];

const addManager = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the managers name?",
        validate: (name) => {
          if (name) {
            return true;
          } else {
            console.log("Please enter a name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "id",
        message: "What is the managers ID?",
        validate: (id) => {
          if (id) {
            return true;
          } else {
            console.log("Please enter an ID");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "email",
        message: "What is the managers email?",
        validate: (email) => {
          if (email) {
            return true;
          } else {
            console.log("Please enter a email");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "officeNumber",
        message: "What is the managers officeNumber?",
        validate: (officeNumber) => {
          if (officeNumber) {
            return true;
          } else {
            console.log("Please enter a office number");
            return false;
          }
        },
      },
    ])
    .then((res) => {
      const { name, id, email, officeNumber } = res;
      const manager = new Manager(name, id, email, officeNumber);

      team.push(manager);
      addEmployee();
      console.log(team);
    });
};

const addEmployee = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "Please choose your employee's role",
        choices: ["Engineer", "Intern"],
      },
      {
        type: "input",
        name: "name",
        message: "What is the name of the employee?",
        validate: (name) => {
          if (name) {
            return true;
          } else {
            console.log("Please enter an employee's name!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "id",
        message: "Please enter the employee's ID.",
        validate: (id) => {
          if (isNaN(id)) {
            console.log("Please enter the employee's ID!");
            return false;
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        name: "email",
        message: "Please enter the employee's email address.",
        validate: (email) => {
          valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
          if (valid) {
            return true;
          } else {
            console.log("Please enter an email address");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "github",
        message: "Please enter the employee's github username.",
        when: (input) => input.role === "Engineer",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter the employee's github username");
          }
        },
      },
      {
        type: "input",
        name: "school",
        message: "Please enter the intern's name of school",
        when: (input) => input.role === "Intern",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter the intern's school name");
          }
        },
      },
      {
        type: "confirm",
        name: "confirmAddEmployee",
        message: "add another team member?",
        default: false,
      },
    ])
    .then((employeeData) => {
      const { name, id, email, role, github, school, confirmAddEmployee } =
        employeeData;

      if (role === "Engineer") {
        employee = new Engineer(name, id, email, github);
      } else if (role === "Intern") {
        employee = new Intern(name, id, email, school);
      }

      team.push(employee);

      if (confirmAddEmployee) {
        return addEmployee(team);
      } else {
        console.log(team);
        return team;
      }
    })
    .then((team) => {
      return render(team);
    })
    .then((writeHTML) => {
      return writeFile(writeHTML);
    })
    .catch((err) => {
      console.log(err);
    });
};

// function to generate HTML page file using file system
const writeFile = (data) => {
  fs.writeFile(outputPath, data, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Your team profile has been successfully created!");
    }
  });
};

addManager();
