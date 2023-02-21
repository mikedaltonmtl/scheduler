import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

export default function useApplicationData() {
  
  const initialState = {
      day: "Monday",
      days: [],
      appointments: {},
      interviewers: {},
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