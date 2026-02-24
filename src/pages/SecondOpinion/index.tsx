import * as React from "react";
import Layout from "../../components/Layout";
import GeneralTable from "../../components/GridTable";
import { MODULES } from "../../utils/constants";
import { COLUMNS } from "./constants";
import EditSecondOpinionDialog from "./EditSecondOpinionDialog";
import { useSecondOpinionStore } from "../../services/secondOpinion";

const FILE_BASE_URL = "https://myewacare.com/api/v1"; // base URL for files
// const FILE_BASE_URL = "http://93.127.199.40:4031/api/"; // base URL for files

export default function SecondOpinion() {
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
    onDelete
  } = useSecondOpinionStore();

  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleClickOpen = () => {
    setSelectedId(null);
    setOpen(true);
  };

  const toggleModal = (value: boolean) => {
    setOpen(value);
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    toggleModal(true);
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
    <Layout appBarTitle="Second Opinion Records">
      {/* Dialog for Add/Edit Second Opinion */}
      <Layout.Header
        component={EditSecondOpinionDialog}
        props={{
          isModalOpen: open,
          toggleModal,
          selectedId,
          fileBaseUrl: FILE_BASE_URL // pass base URL to dialog
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
          module: MODULES.SECOND_OPINION,
          onDelete: (row: any) => onDelete(row._id),
          onEdit: (row: any) => handleEdit(row._id)
        }}
      />
    </Layout>
  );
}
