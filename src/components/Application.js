import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";


export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });
  const setDays = days => setState(prev => ({ ...prev, days }));

  // Fetch the days from the API and add to state
  useEffect(() => {
    axios.get('http://localhost:8001/api/days').then((response) => setDays(response.data));
  }, []);

  // Create the list of Appointment components for each day
  const apptComponents = Object.values(appointments).map(appt => {
    return (
      <Appointment
        key={appt.id}
        {...appt}
      />);
  });
  // Add a final component to the array to indicate the end of the day
  apptComponents.push(<Appointment key="last" time="5pm" />);


  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
          </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {apptComponents}
      </section>
    </main>
  );
};
