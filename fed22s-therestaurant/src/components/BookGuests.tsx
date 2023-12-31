import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { BookingDispatchContext } from "../contexts/BookingDispatchContext";
import { ActionTypeCurrentBooking } from "../reducers/CurrentBookingReducer";
import { CurrentBookingContext } from "../contexts/BookingsContext";
import { Button } from "./styled/Buttons";
import { Input, StyledForm } from "./styled/Forms";
import { GuestBox, GuestBoxWrapper, GuestWrapper } from "./styled/GuestBox";
import {
  ContactContainer,
  ContactInfoContainer,
} from "./styled/ContactContainer";
import { ImageContainer } from "./styled/Containers";
import { GuestInfoSpan, StyledSpan } from "./styled/Texts";

export interface IChooseGuests {
  goToCalendar: () => void;
  isAdmin: boolean;
}

export interface IGuest {
  guests: number;
  selected: boolean;
}
export const BookGuests = ({ goToCalendar, isAdmin }: IChooseGuests) => {
  const [numberOfGuests, setNumberOfGuests] = useState<IGuest[]>([
    { guests: 1, selected: false },
    { guests: 2, selected: false },
    { guests: 3, selected: false },
    { guests: 4, selected: false },
    { guests: 5, selected: false },
    { guests: 6, selected: false },
    { guests: 7, selected: false },
    { guests: 8, selected: false },
    { guests: 9, selected: false },
    { guests: 10, selected: false },
    { guests: 11, selected: false },
    { guests: 12, selected: false },
  ]);

  const currentBooking = useContext(CurrentBookingContext);
  const dispatch = useContext(BookingDispatchContext);
  const [html, setHtml] = useState<JSX.Element>(<></>);
  const [guestsString, setGuestsString] = useState("");
  const [boxHtml, setBoxHtml] = useState<JSX.Element>(<></>);

  const handleClick = (guests: number) => {
    const updatedGuests = numberOfGuests.map((guest) => {
      if (guest.guests === guests) {
        return {
          ...guest,
          selected: true,
        };
      } else {
        return {
          ...guest,
          selected: false,
        };
      }
    });

    setNumberOfGuests(updatedGuests);

    dispatch({
      type: ActionTypeCurrentBooking.SET_NUMBER_OF_GUESTS,
      payload: guests,
    });

    let tables = guests / 6 + 0.4;
    tables = Math.round(tables);

    dispatch({
      type: ActionTypeCurrentBooking.SET_BOOKED_TABLES,
      payload: tables,
    });

    console.log("Antal bord ", tables);

    setHtml(<></>);
  };

  const checkNumberOfGuests = () => {
    if (
      currentBooking.numberOfGuests === 0 ||
      guestsString === "0" ||
      guestsString === ""
    ) {
      setHtml(<div>Du måste välja antalet gäster innan du går vidare</div>);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "number") {
      setGuestsString(e.target.value.toString());
    }
    dispatch({
      type: ActionTypeCurrentBooking.SET_NUMBER_OF_GUESTS,
      payload: parseInt(guestsString),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    const guests = parseInt(guestsString);

    dispatch({
      type: ActionTypeCurrentBooking.SET_NUMBER_OF_GUESTS,
      payload: guests,
    });

    let tables = guests / 6 + 0.4;
    tables = Math.round(tables);

    dispatch({
      type: ActionTypeCurrentBooking.SET_BOOKED_TABLES,
      payload: tables,
    });

    console.log(tables);
    currentBooking.bookingId = JSON.stringify(new Date().getTime());
    goToCalendar();
  };

  if (!isAdmin) {
    return (
      <ContactContainer>
        <ImageContainer img={"src/assets/plate-figgs.jpg"}>
          <img />
        </ImageContainer>
        <GuestWrapper>
          <p>Välj antalet gäster</p>
          <GuestBoxWrapper>
            {numberOfGuests.map((guest) => (
              <GuestBox
                selected={guest.selected}
                key={guest.guests}
                onClick={() => {
                  handleClick(guest.guests);

                  console.log(numberOfGuests);
                }}
              >
                {guest.guests}
              </GuestBox>
            ))}{" "}
          </GuestBoxWrapper>{" "}
          <GuestInfoSpan>
            Vid sällskap fler än 12, vänligen kontakta oss så hjälper vi dig!
          </GuestInfoSpan>
          <Button
            type="button"
            onClick={() => {
              if (currentBooking.numberOfGuests !== 0) {
                goToCalendar();
              } else {
                checkNumberOfGuests();
              }
            }}
          >
            Nästa
          </Button>
          {html}
        </GuestWrapper>
      </ContactContainer>
    );
  } else {
    return (
      <ContactContainer>
        <ImageContainer img={"src/assets/plate-figgs.jpg"}>
          <img />
        </ImageContainer>
        <ContactInfoContainer>
          <GuestWrapper>
            <p>Här väljer du antalet gäster</p>
            <StyledForm
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (
                  guestsString === "0" ||
                  currentBooking.numberOfGuests === 0 ||
                  guestsString === ""
                ) {
                  checkNumberOfGuests();
                } else {
                  handleSubmit(e);
                }
              }}
            >
              <Input
                type="number"
                placeholder="Antal gäster"
                name="phonenumber"
                onChange={handleChange}
                value={guestsString}
                required
              />

              <Button>Nästa</Button>
            </StyledForm>
            {html}
          </GuestWrapper>
        </ContactInfoContainer>
      </ContactContainer>
    );
  }
};
