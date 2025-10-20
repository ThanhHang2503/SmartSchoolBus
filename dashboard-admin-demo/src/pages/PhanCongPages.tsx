import React from "react";
import { DataGrid, GridColDef ,GridPaginationModel} from "@mui/x-data-grid";
import Grid from "@mui/material/Grid"; // Grid2 chuẩn MUI 7
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useState } from 'react';


interface Assignment {
  id: number;
  employee: string;
  route: string;
  shift: string;
  date: string;
}

const initialAssignments: Assignment[] = [
  { id: 1, employee: "Nguyen Van A", route: "Tuyến 1", shift: "Sáng", date: "2025-10-21" },
  { id: 2, employee: "Tran Thi B", route: "Tuyến 2", shift: "Chiều", date: "2025-10-21" },
  { id: 3, employee: "Le Van C", route: "Tuyến 3", shift: "Sáng", date: "2025-10-22" },
];
const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
  pageSize: 5,
  page: 0,
});


export default function PhanCongPage() {
  const [assignments, setAssignments] = React.useState<Assignment[]>(initialAssignments);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editAssignment, setEditAssignment] = React.useState<Assignment | null>(null);
  const [formData, setFormData] = React.useState({
    employee: "",
    route: "",
    shift: "",
    date: "",
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "employee", headerName: "Nhân Viên", width: 200 },
    { field: "route", headerName: "Tuyến", width: 150 },
    { field: "shift", headerName: "Ca", width: 120 },
    { field: "date", headerName: "Ngày", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 180,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ marginRight: 1 }}
          >
            Sửa
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setFormData({ employee: "", route: "", shift: "", date: "" });
    setEditAssignment(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: Assignment) => {
    setFormData({
      employee: row.employee,
      route: row.route,
      shift: row.shift,
      date: row.date,
    });
    setEditAssignment(row);
    setOpenDialog(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch trình này?")) {
      setAssignments(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSave = () => {
    if (editAssignment) {
      setAssignments(prev =>
        prev.map(a =>
          a.id === editAssignment.id ? { ...a, ...formData } : a
        )
      );
    } else {
      const newAssignment: Assignment = {
        id: assignments.length ? Math.max(...assignments.map(a => a.id)) + 1 : 1,
        ...formData,
      };
      setAssignments(prev => [...prev, newAssignment]);
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý Lịch Trình
      </Typography>

      {/* Nút Thêm */}
      {/* <Grid container spacing={2} mb={2}>
        <Grid item  sx={{ width: 'auto' }}>
            <Button variant="contained" color="primary" onClick={handleAdd}>
            Thêm lịch trình
            </Button>
        </Grid>
    </Grid> */}
    

    <Grid {...({ item: true, sx: { width: 'auto' } } as any)}>
  <Button variant="contained" color="primary" onClick={handleAdd}>
            Thêm lịch trình
            </Button>
</Grid>


      {/* DataGrid */}
      {/* <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={assignments}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div> */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={assignments}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5]}
        />
      </div>


      {/* Dialog Thêm / Sửa */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editAssignment ? "Cập nhật lịch trình" : "Thêm lịch trình"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nhân Viên"
            fullWidth
            value={formData.employee}
            onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tuyến"
            fullWidth
            value={formData.route}
            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Ca"
            fullWidth
            value={formData.shift}
            onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Ngày"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
