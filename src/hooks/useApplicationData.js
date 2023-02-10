import { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  
  const initialState = {
      day: "Monday",
      days: [],
      appointments: {},
      interviewers: {},
  };

  const SET_DAY = "SET_DAY";
  const SET_DAYS = "SET_DAYS"
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {

    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day }
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        }
      case SET_DAYS:
        return { ...state, days: action.days }
      case SET_INTERVIEW:
        const updatedState = { ...state, appointments: action.appointments };
        const updatedDays = updateSpots(updatedState);
        updatedState.days = updatedDays;
        return updatedState;
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };
  // Pass a reducer and the initial state
  const [state, dispatch] = useReducer(reducer, initialState);

  // Manage the change when the user clicks on a DayListItem component
  const setDay = day => dispatch({ type: SET_DAY, day: day });

  // Use WebSockets for multiple browser functionality
  useEffect(() => {
    // Do not fire if state has not been populated yet
    if (!state.appointments['1']) {
      return;
    }
    // Fetch the url from the .env.development file
    const url = process.env.REACT_APP_WEBSOCKET_URL;
    // Attempt connection with server
    const ws = new WebSocket(url);
    // Send test message once connection has been established
    ws.onopen = (event) => {
      ws.send('ping');
    };
    // Listener for server messages
    ws.onmessage = (event) => {

      const msg = JSON.parse(event.data);
      // If the server is sending a SET_INTERVIEW message update the browser
      if (msg.type === "SET_INTERVIEW") {
        // Update the appointments in state
        const appointment = {
          ...state.appointments[msg.id],
          interview: msg.interview
        };
    
        const appointments = {
          ...state.appointments,
          [msg.id]: appointment
        };
        // Dispatch the changes
        dispatch({ type: SET_INTERVIEW, appointments: appointments });
      }
    };
  }, [state.appointments]);

  // Fetch the data from the API and add to state
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then((all) => {
      dispatch({ 
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });
  }, []);


  function updateSpots(state) {
    
    console.log('state.appointments', state.appointments);

    // id parameter is the appointment id in the appointments array of a day... find the day
    let emptySpots = 0;
    const dayName = state.day;

    const newDays = state.days.map(day => {
      // Use our appointment id to find the current day
      if (day.name === dayName) {
        // We have the day, now we can iterate over it's appointments array
        console.log('found day', day);

        for (const appointmentId of day.appointments) {
          // Each null interview is an empty spot
          if (state.appointments[appointmentId].interview === null) {
            console.log('appointmentId', appointmentId, 'is null');
            emptySpots ++;
            console.log('emptySpots', emptySpots);
          }
          day.spots = emptySpots;
        }
      }
      return day;
    });
    return newDays;
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
    })
    .then(() => dispatch({ type: SET_INTERVIEW, appointments: appointments }));
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
    .then(() => dispatch({ type: SET_INTERVIEW, appointments: appointments }));
  };

  return { state, setDay, bookInterview, cancelInterview };
};