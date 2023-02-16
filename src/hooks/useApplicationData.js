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
        // Don't update state immediately, wait to update days object also (to avoid stale state)
        // Prepare a new state object with an updated appointments object
        const updatedState = { ...state, appointments: action.appointments };
        // Get the updated days object
        const updatedDays = updateSpots(updatedState, action.id);
        // Update the new state object with the new days object
        updatedState.days = updatedDays;
        // Update state with both of the changed objects
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
    // Do not fire if state has not been populated yet (initial render)
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

        dispatch({ type: SET_INTERVIEW, appointments: appointments, id: msg.id });
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

  // Function will receive the current state and update the spots count in the days object
  // It will NOT update state direcly, but will return an up to date days object to be put in state
  function updateSpots(state, id) {
    let emptySpots = 0;
    let dayName = state.day;
    /**
     * If an appointment has been changed by a different browser (because of WebSockets functionality),
     * the day.name in state may be different to that of this browser, so we need to use the
     * appointment id to get the day (dayName) whose spots need to be updated
    */ 
    if (id) {
      for (const updatedDay of state.days) {
        if (updatedDay.appointments.includes(id)) {
          dayName = updatedDay.name;
          break;
        }
      }
    }

    const newDays = state.days.map(day => {
      // Use our appointment id to find the current day
      if (day.name === dayName) {
        // We have the day, now we can iterate over it's appointments array
        for (const appointmentId of day.appointments) {
          // Each null interview is an empty spot
          if (state.appointments[appointmentId].interview === null) {
            emptySpots ++;
          }
          // Update the number of empty spots in the day object
          day.spots = emptySpots;
        }
      }
      return day;
    });
    return newDays;
  };

  // Called when user clicks the save button in form mode
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
    .then(() => dispatch({ type: SET_INTERVIEW, appointments: appointments, id: false }));
    };

  // Called when user clicks delete icon on an interview component
  function cancelInterview(id) {
    // To delete an appointment, set it's interview data to null
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
    .then(() => dispatch({ type: SET_INTERVIEW, appointments: appointments, id: false }));
  };

  return { state, setDay, bookInterview, cancelInterview };
};