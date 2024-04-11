import React, { useState } from "react";
import HistoriaOrders from "./components/Restauracje/HistoriaOrders";
import { useParams } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { pl } from "date-fns/locale";
import DatePicker from "react-datepicker";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus as fasFaPlus,
  faCalendarDays,
  faFileInvoice,
  faArrowDownShortWide,
  faList,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/Order.css";
import "react-datepicker/dist/react-datepicker.css";


const Historia = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeChanged, setDateRangeChanged] = useState(false);
  const { restaurantId } = useParams();
  const [searchStreet, setSearchStreet] = useState('');

  const handleSearchChange = (e) => {
    setSearchStreet(e.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setDateRangeChanged(true);
  };
  
  const handleEndDateChange = (date) => {
    setEndDate(date);
    setDateRangeChanged(true);
  };

  return (
    <div className="order white-rounded-box">
      <div className="row">
        <div className="left-group">
          {/* <div className="group-text">Historia</div> */}
        </div>
        <div className="right-groups">

        <div className="input-group">
          
          <input
            type="text"
            placeholder="Szukaj ulicy"
            value={searchStreet}
            onChange={handleSearchChange}
          />
        </div>

        <div className="input-group datepicker-group">
            <FontAwesomeIcon
              icon={faCalendarDays}
              size="lg"
              style={{ paddingRight: "7px", fontWeight: "800" }}
            />
            <DatePicker
              selected={startDate}
              onChange={(date) => handleStartDateChange(date)}
              dateFormat="yy-MM-dd"
              customInput={<input type="text" />}
              locale={pl}
            />
            <span>-</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => handleEndDateChange(date)}
              dateFormat="yy-MM-dd"
              minDate={startDate}
              customInput={<input type="text" />}
              locale={pl}
            />
          </div>


          <NavLink to={`/dashboard-admin/restaurant/orders/${restaurantId}`}>
            <div className="group-botton">
              <FontAwesomeIcon
                icon={faList}
                size="lg"
                style={{ paddingRight: "7px", fontWeight: "800" }}
              />
              Historia Zamówień
            </div>
          </NavLink>

          <NavLink to="/dashboard-admin/zamowienia">
            <div className="group-botton-1">
              <FontAwesomeIcon
                icon={faArrowDownShortWide}
                size="lg"
                style={{ paddingRight: "7px", fontWeight: "800" }}
              />
              Wszystkie Zamówienia
            </div>
          </NavLink>
        </div>
      </div>
      <HistoriaOrders
        startDate={startDate}
        endDate={endDate}
        dateRangeChanged={dateRangeChanged}
        setDateRangeChanged={setDateRangeChanged}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
        searchStreet={searchStreet}
      />
    </div>
  );
};

export default Historia;
