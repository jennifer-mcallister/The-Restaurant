import { useContext, useState } from "react";
import { BookingDispatchContext } from "../contexts/BookingDispatchContext";
import Calendar from "react-calendar";
import { ActionTypeCurrentBooking } from "../reducers/CurrentBookingReducer";
import { Booking } from "../models/Booking";
import { getBookingsByDate } from "../serivces/BookingServices";
import { CurrentBookingContext } from "../contexts/BookingsContext";

interface ICalendarProps {
  goToGuests: () => void;
  goToForm: () => void;
}

interface ISittings {
  sitting: number,
  bookedTables: number,
  availabel: boolean,
}

export const CalendarPage = ({ goToGuests, goToForm }: ICalendarProps) => {
  const dispatch = useContext(BookingDispatchContext);
  const currentBooking = useContext(CurrentBookingContext);

  const [firstSitting, setFirstSitting] = useState<ISittings>({sitting: 1, bookedTables: 0, availabel: true});
  const [secondSitting, setSecondSitting] = useState<ISittings>({sitting: 2, bookedTables: 0, availabel: true});
  const [selectedDate, setSelectedDate] = useState("");

const handleClick = (day: Date) => {
  const date = convertDateToString(day);
  setSelectedDate(date);

  const getData = async () => {
    const bookingsFromApi = await getBookingsByDate(date);
    countAvaibleTables(bookingsFromApi);
  }
  
  getData();
}

const countAvaibleTables = (bookingsOnSelectedDate: Booking[]) => {
  let bookedTablesFirstSitting = 0;
  let bookedTablesSecondSitting = 0;

  for ( let i = 0; i < bookingsOnSelectedDate.length; i++) {
    const tables = bookingsOnSelectedDate[i].bookedTables;

    if (bookingsOnSelectedDate[i].sitting === 1) {
      bookedTablesFirstSitting = bookedTablesFirstSitting + tables;
    }

    if (bookingsOnSelectedDate[i].sitting === 2) {
      bookedTablesSecondSitting = bookedTablesSecondSitting + tables;
    }
  }

  setFirstSitting({...firstSitting, 
    bookedTables: bookedTablesFirstSitting, 
    availabel: (currentBooking.bookedTables  <= (15 - bookedTablesFirstSitting) ? true : false )
  })
  setSecondSitting({...secondSitting, 
    bookedTables: bookedTablesSecondSitting,
    availabel: (currentBooking.bookedTables  <= (15 - bookedTablesSecondSitting) ? true : false )
  })
}

const convertDateToString = (day: Date) => {
  let month: string = (day.getMonth() + 1).toString();
  let dateDay: string = day.getDate().toString();
  if (month.length === 1) {
    month = "0" + month;
  }
  if (dateDay.length === 1) {
    dateDay = "0" + dateDay;
  }
  let chosenDate = day.getFullYear().toString() + month + dateDay;
  return chosenDate;
}

  return (
    <>
      <button
        type="button"
        onClick={() => {
          goToGuests();
        }}
      >
        Tillbaka
      </button>
      <Calendar
        onClickDay={(day) => {handleClick(day)}}
      ></Calendar>
      <button 
        disabled={!firstSitting.availabel}
        onClick={() => {
          dispatch({type: ActionTypeCurrentBooking.SET_SITTING, payload: 1});
          dispatch({type: ActionTypeCurrentBooking.SET_DATE, payload: selectedDate});
        }}>Kl. 18:00 - 20:00</button>

      <button 
        disabled={!secondSitting.availabel}
        onClick={() => {
          dispatch({type: ActionTypeCurrentBooking.SET_SITTING, payload: 2});
          dispatch({type: ActionTypeCurrentBooking.SET_DATE, payload: selectedDate});
        }}>Kl. 20:00 - 22:00</button>

      <button type="button" onClick={() => goToForm()}>
        Nästa
      </button>
    </>
  );
};
