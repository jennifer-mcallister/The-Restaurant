import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Contact } from "./components/Contact";
import { Confirmation } from "./components/Confirmation";
import { Admin } from "./components/Admin";
import { BookingComponent } from "./components/BookingComponent";
import { CancelBooking } from "./components/CancelBooking";
import { CancelConfirmation } from "./components/CancelConfirmation";
import { CancelLayout } from "./components/CancelLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/cancel/:bookingId",
        element: <CancelBooking></CancelBooking>,
      },
      {
        path: "/cancel/confirmation",
        element: <CancelConfirmation></CancelConfirmation>,
      },

      {
        path: "/booking",
        element: <BookingComponent isAdmin={false}></BookingComponent>,
      },
      {
        path: "/contact",
        element: <Contact></Contact>,
      },
      {
        path: "/confirmation",
        element: <Confirmation></Confirmation>,
      },
      {
        path: "/admin",
        element: <Admin></Admin>,
      },
    ],
  },
]);
