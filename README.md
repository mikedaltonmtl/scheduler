# Interview Scheduler

## About Interview Scheduler

Interview Scheduler is a single-page application (SPA) that allows users to book technical interviews between students and mentors. Appointments can be between the hours of 12 PM and 5 PM, Monday to Friday. Each appointment has one student and one interviewer.

When creating a new appointment, the user can enter any student name while the interviewer is chosen from a predefined list. The user can save the appointment and view the entire schedule of appointments on any day of the week.

Appointments can also be edited or deleted.

The front end of this project is built with React and makes requests to an API to fetch and store appointment data from a database.

## Purpose

This project is part of my learnings at Lighthouse Labs.

## Project Outcomes

- Use React to create a single page application (SPA) called Interview Scheduler.

- Have the client application communicate with an API server over HTTP, using Axios to make calls to the API.

- Gain experience with different development environments, including Storybook, Jest, and Webpack Dev Server.

## Setup

Install dependencies with `npm install`.

## Dependencies

- "axios": "^0.20.0",
- "classnames": "^2.2.6",
- "normalize.css": "^8.0.1",
- "react": "^16.9.0",
- "react-dom": "^16.9.0",
- "react-scripts": "3.4.4"

## Dev Dependencies
- "@storybook/addon-actions": "^5.0.10",
- "@babel/core": "^7.4.3",
- "@storybook/addon-backgrounds": "^5.0.10",
- "@storybook/addon-links": "^5.0.10",
- "@storybook/addons": "^5.0.10",
- "@storybook/react": "^5.0.10",
- "@testing-library/jest-dom": "^4.0.0",
- "@testing-library/react": "^8.0.7",
- "@testing-library/react-hooks": "^8.0.1",
- "babel-loader": "8.1.0",
- "prop-types": "^15.8.1",
- "react-test-renderer": "^16.9.0",
- "sass": "^1.53.0"

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Project Structure
├── .storybook
├── cypress
│   ├── downloads
│   ├── fixtures
│   ├── integration
│   ├── plugins
│   └── support
├── public
│   └── images
├── src
│   ├── __mocks__
│   ├── components
│   │   ├── __tests__
│   │   └── Appointment
│   ├── helpers
│   ├── hooks
│   │   └── __tests__
│   ├── reducers
│   └── styles
└── stories


