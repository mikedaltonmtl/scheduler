import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = day => setState({ ...state, day });

  // Fetch the data from the API and add to state
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers'),
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    });
  }, []);


  function updateSpots(direction) {
    // Update the spots of the given day
    const newDays = state.days.map(day => {
      if (day.name === state.day) {
        day.spots = (direction === 'decrease') ? day.spots - 1 : day.spots + 1;
      }
      return day;
    });

    setState({...state, newDays});
  };

  // Called when user clicks the save button in Form mode
  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {
      interview: interview
    }).then(res => {
      updateSpots('decrease');
      setState({
        ...state,
        appointments
      });
    });
  };

  // Called when user clicks delete icon on an interview component
  function cancelInterview(id) {
    // To delete an Appointment, set it's Interview data to null
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
    .then(res => {
      updateSpots('increase');
      setState({
        ...state,
        appointments
      });
    });
  };
  return { state, setDay, bookInterview, cancelInterview };
};