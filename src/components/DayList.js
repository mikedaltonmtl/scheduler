import React from "react";
import DayListItem from "components/DayListItem";


export default function DayList(props) {

  const items = props.days.map(item => {
    return <DayListItem
      key={item.id}
      name={item.name} 
      spots={item.spots} 
      selected={item.name === props.day}
      day={item.name}
      setDay={props.setDay}
    />
  });

  return (
    <ul>{items}</ul>
  );
};
