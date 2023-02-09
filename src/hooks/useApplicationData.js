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
        return { ...state, appointments: action.appointments }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };
  // Pass a reducer and the initial state
  const [state, dispatch] = useReducer(reducer, initialState);

  // Manage the change when the user click on a DayListItem component
  const setDay = day => dispatch({ type: SET_DAY, day: day });

  // Fetch the data from the API and add to state
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers'),
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


  function updateSpots(direction) {
    // Update the spots of the given day
    const newDays = state.days.map(day => {
      if (day.name === state.day) {
        day.spots = (direction === 'decrease') ? day.spots - 1 : day.spots + 1;
      }
      return day;
    });
    dispatch({ type: SET_DAYS, days: newDays });
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
      dispatch({ type: SET_INTERVIEW, appointments: appointments });
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
      dispatch({ type: SET_INTERVIEW, appointments: appointments });
    });
  };
  return { state, setDay, bookInterview, cancelInterview };
};