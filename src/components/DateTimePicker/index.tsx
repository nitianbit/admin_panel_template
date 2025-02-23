import DatePicker from "react-datepicker";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "./styles.css"

interface DateTimePickerWithIntervalProps {
    className?: string;
    value: number | null; // timestamp format
    placeholder?: string;
    onChange?: (timestamp: number) => void;
    showTimeSelect?: boolean;
    showTimeSelectOnly?:boolean
}

const formatTimeStampToDate = (timestamp: number): Date => moment.unix(timestamp).toDate();

const DateTimePickerWithInterval: React.FC<DateTimePickerWithIntervalProps> = ({
    className = "",
    value,
    placeholder = "",
    onChange = () => {},
    showTimeSelect = true,
    showTimeSelectOnly=false
}) => {
    const [startDate, setStartDate] = useState<Date | null>(null);

    useEffect(() => {
        if (value) setStartDate(formatTimeStampToDate(value));
    }, [value]);

    return (
        <DatePicker
            selected={startDate}
            onChange={(date) => {
                if (date) {
                    const timestamp = moment(date).unix();
                    setStartDate(date);
                    onChange(timestamp);
                } else {
                    setStartDate(null);
                    // onChange(null);
                }
            }}
            showTimeSelect={showTimeSelect}
            showTimeSelectOnly={showTimeSelectOnly}
            timeIntervals={15}
            placeholderText={placeholder}
            wrapperClassName={`w-100 ${className} react-datepicker-wrapper custom-date-picker-wrapper`}
            dateFormat="dd-MM-yyyy HH:mm"
            className="w-100"
            timeFormat="HH:mm"
        />
    );
};

export default DateTimePickerWithInterval;
