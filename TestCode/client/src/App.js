import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import CreateUser from './components/CreateUser';
import { fetchUserDetails, deleteUser } from './actions';

function App() {
  const [open, setOpen] = useState(false);
  const [updatingData, setUpdatingData] = useState();

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUserDetails())
  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { user } = useSelector(
    ({ userReducer }) => userReducer,
  );


  const deleteUserAction = async (id) => {
    if (window.confirm("Delete the item?")) {
      await deleteUser(id)
      dispatch(fetchUserDetails())
    }
  }

  const handleUpdate = (data) => {
    setUpdatingData(data)
    handleClickOpen()
  }

  return (
    <div>
      <Paper style={{ margin: 10 }} elevation={3} >
        <Button style={{ margin: 5 }} variant="contained" onClick={() => { setUpdatingData(''); handleClickOpen(); }}>Create User</Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">First Name</TableCell>
                <TableCell align="right">Last Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Gender</TableCell>
                <TableCell align="right">Mobile Number</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="right"> {row.firstName} </TableCell>
                  <TableCell align="right">{row.lastName}</TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.gender}</TableCell>
                  <TableCell align="right">{row.mobileNumber}</TableCell>
                  <TableCell align="left">
                    <Button onClick={() => deleteUserAction(row._id)}>Delete</Button>
                    <Button onClick={() => handleUpdate(row)}>Edit</Button>

                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <CreateUser open={open} onClose={handleClose} isUpdate={Boolean(updatingData)} updatingData={updatingData} />

    </div>
  );
}

export default App;
