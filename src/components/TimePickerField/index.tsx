
import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

interface TimePickerFieldProps {
  label: string;
  value?: string;
  field: string;
  onChange: (field: string, value: string) => void;
}

const TimePickerField: React.FC<TimePickerFieldProps> = ({ label, value, field, onChange }) => {
  const formattedDate = value
    ? moment(`${moment().format('DDMMYYYY')}${moment(value, 'HHmm').format('HH:mm')}`, 'DDMMYYYYHHmm').toDate()
    : undefined;

  return (
    <div className="time-container">
      <label>{label}</label>
      <DatePicker
        selected={formattedDate}
        onChange={(date: Date | null) => {
          if (date) {
            onChange(field, moment(date).format('HHmm'));
          }
        }}
        showTimeSelectOnly
        showTimeSelect
        wrapperClassName="w-100 react-datepicker-wrapper custom-date-picker-wrapper"
        dateFormat="dd-MM-yyyy HH:mm"
        className="w-100 time-input"
        timeFormat="HH:mm"
        value={value ? moment(value, 'HHmm').format('hh:mm A') : `Select ${label}`}
        timeInputLabel={label}
        timeIntervals={15}
      />
    </div>
  );
};

export default TimePickerField;
