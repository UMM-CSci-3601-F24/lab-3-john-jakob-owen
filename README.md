[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bRKLjZfx)
# CSCI 3601 Lab #3 - Angular and Javalin Lab <!-- omit in toc -->

- [Setup](#setup)
  - [Open the project in VS Code](#open-the-project-in-vs-code)
  - [Installing the client dependencies](#installing-the-client-dependencies)
  - [Enable ESLint in VS Code](#enable-eslint-in-vs-code)
- [Running your project](#running-your-project)
  - [Starting the server](#starting-the-server)
  - [Starting the client](#starting-the-client)
- [Testing and Continuous Integration](#testing-and-continuous-integration)
  - [Testing the client](#testing-the-client)
    - [Linting the client](#linting-the-client)
  - [Testing the server](#testing-the-server)
  - [End to end testing with Cypress](#end-to-end-testing-with-cypress)
  - [GitHub Actions](#github-actions)
- [Resources](#resources)
  - [Angular](#angular)
  - [Cypress (end-to-end testing)](#cypress-end-to-end-testing)

During this lab, you will build a basic client-side application using Angular,
which will connect to a server-side todo API similar to the one you created in
the previous lab. Your Angular application should enable you
to handle user input, and display data returned from the server in nice ways.
As always, you'll be expected to make good use of the version control and project management tools available to you:

- Write good commit messages
- Use branching and pull requests for features
- Test things
- Document issues and plans
- Etc., etc.

Your specific tasks for this lab can be found in the [LABTASKS.md](LABTASKS.md)
file in this repository.

> :warning: One thing to keep in mind is that the Angular developers provide two
> major updates to Angular each year. This lab is built using Angular 15. Pay attention to
> the version of Angular being used in examples and on-line documentation that you find. Most
> of the time, it won't matter very much, but there are times when something you find
> doesn't match what we're doing. If things seem odd, look at the versions for the
> example or documentation you're looking at just in case there's a mismatch that matters.

## Setup

As in the previous lab, you'll be using VS Code and GitKraken. Once you've all joined your
group using GitHub classroom, you can clone your repository using the command line or GitKraken:

1. From the file menu, choose **Clone Repo**
2. Choose GitHub.com in the middle column (as the source location of your repo)
3. Browse to the location you'd like to put the local copy of this project repo
4. Select the correct repo from the list of repositories
5. Select **Clone the repo!**

### Open the project in VS Code

Launch Visual Studio Code, and then choose `File -> Open Folder…`. Navigate to your clone
of the repo and choose `Open`.

You may see a dialog that looks like this if you don't already have the recommended extensions:

![Dialog suggesting installation of recommended extensions](https://user-images.githubusercontent.com/1300395/72710961-bf767500-3b2d-11ea-8ea4-fbbd39c78da5.png)

Don't worry if you don't get the dialog, it is probably because you already have them all installed.

Like in previous labs, click "Install All" to automatically install them.

### Installing the client dependencies

Before you start working you will need to install the dependencies for the client.

1. Move into the `client` directory (`cd client`)
2. Run `npm install`

### Enable ESLint in VS Code

> :warning: I (Nic) am not 100% sure that this will actually be an issue
> for you. Please let me know if if is or it isn't (e.g., whether you
> see the red "ESLINT" on the bottom bar).

Since this is the first time we will be using ESLint there is an additional step to make sure the VS Code extension is working in the project. When you first open a Script file you will see at the bottom right that ESLint is disabled.

![image](https://user-images.githubusercontent.com/1300395/107999308-bc59ec80-6fac-11eb-9784-75a471a50aa4.png)

Click the red "ESLINT" to open this dialog:

![image](https://user-images.githubusercontent.com/1300395/107996971-528b1400-6fa7-11eb-89bc-afc71747f820.png)

Click "Allow Everywhere" to enable ESLint.

You can also open this dialog with the following steps:

1. Hit `CTRL + SHIFT + P` (`⌘ + ⇧ + P` on Macs) to open the Command Palette. You can also find this by going to the "View" menu and clicking "Command Palette..."
2. Start typing and select "ESlint: Manage Library Execution". That should open a dialog seen above.

## Running your project

To run your project you'll have to start _both_ the server and the
client.

### Starting the server

- The **run** Gradle task (`./gradlew run` in the `server` directory) will still run your Javalin server, which is available at [`localhost:4567`](http://localhost:4567).
- The **build** task will still _build_ the server, but not run it.
- The **test** task will run all the JUnit tests.
- The **check** task will run Checkstyle along with the JUnit tests.

The major difference here is that the _client_ side of your project is,
effectively, an entirely separate project from your Javalin server. We've included a full API
for the todos, which you implemented in Lab 2, so there is no need to copy your old project over.

> We don't expect you to have any reason to actually make _any_ changes on the
> server side of the project, although you're welcome to look it over and ask questions
> about it. We don't really "object" if you make changes to the server code, but
> you should probably think twice about doing it. **If you think you're "fixing"
> something by changing the server code, there's a good chance the problem isn't
> where you think it is.**

### Starting the client

Once you have successfully run `npm install`, in order to serve up the _client side_ of your project, you will run
`ng serve` (from the `client` directory as well). This will trigger the various tools in the
client side portion of the project to build and host your client side
application on their own little web-server, available by default at [`localhost:4200`](http://localhost:4200). If your server is running, you will be able to see data for users if you navigate to the right place in the project.

To recap, **here are the steps needed to _run_ the project**:

1. Go into the `server` directory and enter `./gradlew run`.
2. In a _different_ terminal (or terminal tab), go into the `client`
   directory and enter `ng serve`.
3. You can then go to `localhost:4200` in your favorite web browser
   and see your nifty Angular app.

## Testing and Continuous Integration

There are now more testing options! You can test the client, or the server or both.

> In this lab there's no particular need to test the server since you're probably
> not changing anything there. All the tools are there, however, if you want to
> run the tests and see what that looks like.

### Testing the client

From the `client` directory:

- `ng test` runs the client unit (Karma) tests
  - This will pop up a Chrome window with the results of the tests.
  - This will run "forever", re-running the tests whenever you make a
    change. Both in your terminal and the Chrome
    window will display updated results whenever the tests are re-run. Typing CTRL-C in the terminal window will end
    the `ng test` process and close the generated Chrome window.
- You can add `ng test --no-watch` if you just want to run the tests once
  instead of going into the "run forever" mode.
- `ng test --code-coverage` runs the client tests and generates a coverage report
  - It generates a coverage report in your client directory: `client/coverage/client/index.html`.
  - Right click on `index.html` and select `Copy path` and paste it into your browser of choice. You can also drag and drop `index.html` onto the tab area of your browser and it will open it.
- You can combine these with things like
  `ng test --no-watch --code-coverage` to run the tests once and
  compute the test coverage stats.

#### Linting the client

We have included a tool called ESLint which helps analyze the code and catch various errors. You will most likely see it directly in VS Code as yellow and red underlines. You can also directly run the linter on the entire client by running `ng lint`. This will check the whole client project and tell you if there are any issues.

### Testing the server

From the `server` directory:

- `./gradlew test` runs the server tests once.
  - It generates a report you can find in `server/build/reports/tests/test/index.html`.
- `./gradlew test jacocoTestReport` runs the server tests once and creates a coverage report
  - It generates a coverage report you can find in `server/build/jacocoHtml/index.html` in addition to the regular report generated by the `test` task.

### End to end testing with Cypress

End to end (E2E) testing involves the whole software stack rather than one part of it. Our E2E tests look at the behavior of both the client and server and how they interact by simulating what a real user would do with it.

We use [Cypress](https://www.cypress.io/) for our end-to-end tests. There are a few ways to run the E2E tests. They are all started from the `client` directory and require the server be running at the same time (`./gradlew run` in the `server` directory).

- `ng e2e` both builds and serves the client and runs through all the Cypress end-to-end tests once.
- `ng e2e --watch` builds and serves the client but just opens Cypress for you to be able to run the tests you want without closing automatically.
  - This is the same as running `ng serve` followed by `npm run cy:open` (or `npx cypress open`). If you are already running `ng serve` it will be easier to do this rather than closing it and running `ng e2e`.

> If you're running this on a Mac, macOS will run a validation check
> the first time you run a given version of Cypress. Just wait for that
> to finish, and then everything should move forward fine.

When you first run Cypress `--watch` it'll ask you to choose your
preferred browser for testing. You can use any browser installed on
your computer, but just sticking with "Electron" is probably the
simplest.

After you've chosen a browser, you should get a window with the
main Cypress view, which looks something like this:

![Cypress main window](images/cypress_main_window.png)

You can click on any of the integration test files to run their tests or run them all. When you run a set of tests like the tests in `user-list.cy.ts`, you will see the results of the tests:

![Cypress after running integration tests](images/running_cypress_tests.png)

There are a lot of neat things you can do here like inspect each test and find which selectors to use in the tests you are writing. If click
on the test for filtering by company, for example, we can see the steps
of that test. We can use those to see exactly what's being selected and asserted. If we hover over step six, for example (`find .user-card-company`), we see that the company fields are highlighted
for the two users that work for "OHMNET":

![The Cypress steps for testing filtering by company](images/find-by-company-steps.png)

This can be extremely useful for debugging failing E2E tests, and can
also be a nice way to better understand the structure of the HTML
generated by Angular.

We encourage you to look through some of the Cypress documentation linked in the "Resources" section below.

### GitHub Actions

There are three GitHub Actions workflows set up in your repo:

- [Server Java](../../actions?query=workflow%3A"Server+Java") - JUnit tests for the server (`gradle-build`)
- [Client Angular](../../actions?query=workflow%3A"Client+Angular") - Karma tests (`ng-test`) and ESLint linting (`ng-lint`) for the client
- [End to End](../../actions?query=workflow%3AEnd-to-End) - Cypress tests for end-to-end testing

There are badges above that show the status of these checks on the master branch.

## Resources

### Angular

- [Angular Unit Testing (Karma)](https://angular.io/guide/testing)
- [Angular Routing](https://angular.io/guide/router)
- [Angular Forms](https://angular.io/guide/forms-overview)
- [Angular Material](https://material.angular.io/)
- [What are environments in Angular](https://angular.io/guide/build#configuring-application-environments)
- [Angular CLI](https://angular.io/cli)

### Cypress (end-to-end testing)

- [Cypress Docs](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices.html)
- [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html)
- [Interacting with Elements in Cypress](https://docs.cypress.io/guides/core-concepts/interacting-with-elements.html)
