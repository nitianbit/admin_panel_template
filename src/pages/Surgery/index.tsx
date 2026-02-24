import * as React from "react";
import Appbar from "../../components/Appbar";
import Container from "@mui/material/Container";
import Layout from "../../components/Layout";
import GeneralTable from "../../components/GridTable";
import { MODULES } from "../../utils/constants";
import { COLUMNS } from "./constants";
import EditSurgeryDialog from "./EditSurgeryDialog";
import { useSurgeryStore } from "../../services/surgery/index";

const FILE_BASE_URL = "https://myewacare.com/api/v1"; // <--- base URL for files
// const FILE_BASE_URL = "http://93.127.199.40:4031/api/"; // <--- base URL for files

export default function Surgery() {
  const {
    data,
    total,
    totalPages,
    currentPage,
    isLoading,
    fetchGrid,
    onPageChange,
    nextPage,
    prevPage,
    onDelete,
    detail
  } = useSurgeryStore();

  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleClickOpen = () => {
    setSelectedId(null);
    setOpen(true);
  };

  const toggleModal = (value: boolean) => {
    setOpen(value);
  };

  const handleEdit = async (id: string) => {
    setSelectedId(id);
    toggleModal(true);
    await detail(id);
  };

  React.useEffect(() => {
    fetchGrid();
  }, []);

  // Transform file URLs before passing to table/dialog
  const transformedData = data.map((item: any) => ({
    ...item,
    medical_record: item.medical_record?.map((file: string) =>
      file.startsWith("http") ? file : `${FILE_BASE_URL}${file}`
    )
  }));

  return (
    <Layout appBarTitle="Surgery Records">
      {/* Dialog for Add/Edit Surgery */}
      <Layout.Header
        component={EditSurgeryDialog}
        props={{
          isModalOpen: open,
          toggleModal,
          selectedId,
          fileBaseUrl: FILE_BASE_URL // pass base URL to dialog too
        }}
      />

      {/* Table */}
      <Layout.Body
        component={GeneralTable}
        props={{
          data: transformedData,
          columns: COLUMNS,
          currentPage,
          totalPages,
          total,
          loading: isLoading,
          onPageChange,
          module: MODULES.SURGERY,
          onDelete: (row: any) => onDelete(row._id),
          onEdit: (row: any) => handleEdit(row._id)
        }}
      />
    </Layout>
  );
}
