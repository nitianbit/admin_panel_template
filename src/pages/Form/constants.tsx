import moment from "moment";

export const COLUMNS = [
  {
    header: "Full Name",
    accessor: "full_name",
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Gender",
    accessor: "gender",
    render: (data: any) => data?.gender?.charAt(0).toUpperCase() + data?.gender?.slice(1),
  },
  {
    header: "Age",
    accessor: "age",
  },
  {
    header: "Mobile",
    accessor: "mobile",
  },
  {
    header: "Address",
    accessor: "address",
  },
  {
    header: "Enquire About",
    accessor: "enquire_about",
  },
  {
    header: "Submitted At",
    accessor: "createdAt",
    render: (data: any) =>
      data?.createdAt ? moment(data.createdAt).format("DD-MM-YYYY hh:mm A") : "-",
  },
];
