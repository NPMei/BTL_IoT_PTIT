import * as React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TextField, Select, MenuItem, InputLabel, FormControl, Button, FormControlLabel } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

// Hàm gọi API để lấy dữ liệu từ server
const fetchData = async (filters) => {
    try {
      const { startDay, startHour, endDay, endHour, orderBy ,rowsPerPage, page, revSort, searchFan, searchLamp, searchAC} = filters;
      const response = await fetch(`http://127.0.0.1:8000/api/device-data/?start=${startDay}T${startHour}&end=${endDay}T${endHour}&orderby=${orderBy}&rowsperpage=${rowsPerPage}&page=${page}&revsort=${revSort}&searchLamp=${searchLamp}&searchFan=${searchFan}&searchAC=${searchAC}`); // Thay đổi URL này thành URL API thực tế của bạn
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };
  
export default function EnhancedTable() {
    // Dữ liệu mẫu
    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('time');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [dense, setDense] = React.useState(false);
    const [count, setCount] = React.useState(0);
    const [revSort, setRevSort] = React.useState(false);
    const [searchLamp, setSearchLamp] = React.useState(true);
    const [searchFan, setSearchFan] = React.useState(true);
    const [searchAC, setSearchAC] = React.useState(true);

    // State for date and time filters
    const [startDay, setStartDay] = React.useState(new Date().getDate());
    const [startHour, setStartHour] = React.useState('00:00:00');
    const [endDay, setEndDay] = React.useState(new Date().getDate());
    const [endHour, setEndHour] = React.useState('23:59:59');

    const handleFetchData = React.useCallback(async () => {
        const filters = { startDay, startHour, endDay, endHour, orderBy, rowsPerPage, page, revSort , searchFan, searchLamp, searchAC };
        const apiData = await fetchData(filters);
        setRows(apiData.results); // Set rows from the "results" array
        setCount(apiData.count); // Set count from the "count" value
      }, [ startDay, startHour, endDay, endHour, orderBy, rowsPerPage, page, revSort, searchFan, searchLamp, searchAC]);
      
    // handle thay đổi chỉ số
    React.useEffect(() => {
        handleFetchData();
    }, [revSort,page, rowsPerPage,handleFetchData]);

    
    const handleRevSort = () => {
        const newRevSort = !revSort;
        setRevSort(newRevSort);
    };
        

    const handleStartDayChange = (event) => setStartDay(event.target.value);
    const handleStartHourChange = (event) => setStartHour(event.target.value);
    const handleEndDayChange = (event) => setEndDay(event.target.value);
    const handleEndHourChange = (event) => setEndHour(event.target.value);
    const handleChangeOrderBy = (event) => setOrderBy(event.target.value)
    
    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'ID',
        },
        {
            id: 'device',
            numeric: false,
            disablePadding: false,
            label: 'Device',
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: false,
            label: 'Status',
        },
        {
            id: 'timestamp',
            numeric: false,
            disablePadding: true,
            label: 'Time',
        },
    ];

    function EnhancedTableHead(props) {
        const { onSelectAllClick, numSelected, rowCount, onRequestSort } = props;
        const createSortHandler = (property) => (event) => {
            onRequestSort(event, property);
        };

        return (
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    EnhancedTableHead.propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        rowCount: PropTypes.number.isRequired,
        
    };

    function EnhancedTableToolbar(props) {
        const { numSelected } = props;

        return (
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Tooltip title="Xóa">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Lọc danh sách">
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
        );
    }

    // handle việc chia trang
    EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    };

    const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
    if (event.target.checked) {
        const newSelected = rows.map((n) => n.id);
        setSelected(newSelected);
        return;
    }
    setSelected([]);
    };

    const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
    } else {
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Tránh nhảy layout khi đạt đến trang cuối với các hàng trống.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    // Lấy dữ liệu hiển thị hiện tại
    const currentRows = rows.slice(0, rowsPerPage);

    // Sắp xếp dữ liệu hiện tại
    const sortedRows = currentRows.slice().sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        if (orderBy === 'id') {
            return order === 'asc'
              ? a.id - b.id
              : b.id - a.id;
          }
        return 0;
    });

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                {/* Filters for start date and time */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDay}
                        onChange={handleStartDayChange}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <TextField
                        label="Start Time"
                        type="time"
                        value={startHour}
                        onChange={handleStartHourChange}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Box>

                {/* Filters for end date and time */}
                <Box sx={{ display: 'flex', gap: 2, marginLeft: 2 }}>
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDay}
                        onChange={handleEndDayChange}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <TextField
                        label="End Time"
                        type="time"
                        value={endHour}
                        onChange={handleEndHourChange}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Box>
            <Box sx={{ display: 'flex', gap: 2, marginLeft: 2 }}>
                <IconButton onClick={handleRevSort}>
                    {revSort ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                </IconButton>
                <FormControl sx={{ mt: 2 }}>
                    <InputLabel id="order-by-select-label">Order By</InputLabel>
                        <Select
                            labelId="order-by-select-label"
                            value={orderBy}
                            onChange={handleChangeOrderBy}
                            label="Order By"
                        >
                            <MenuItem value="id">ID</MenuItem>
                            <MenuItem value="device">Device</MenuItem>
                            <MenuItem value="status">Status</MenuItem>
                            <MenuItem value="time">Time</MenuItem>
                        </Select>
                    </FormControl>
            </Box>
            
                
            </Box>
                {/* Nút tích cho Lamp */}
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={searchLamp}
                        onChange={(e) => setSearchLamp(e.target.checked)}
                    />
                    }
                    label="Lamp"
                />

                {/* Nút tích cho Fan */}
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={searchFan}
                        onChange={(e) => setSearchFan(e.target.checked)}
                    />
                    }
                    label="Fan"
                />

                {/* Nút tích cho Air Conditioner */}
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={searchAC}
                        onChange={(e) => setSearchAC(e.target.checked)}
                    />
                    }
                    label="Air Conditioner"
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            // numSelected={selected.length}
                            // order={order}
                            // orderBy={orderBy}
                            // onSelectAllClick={handleSelectAllClick}
                            // onRequestSort={handleRequestSort}
                            // rowCount={rows.length}
                        />
                        <TableBody>
                            {currentRows.map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell align="right" sx={{ width: 50 }}>{row.id}</TableCell>
                                        <TableCell align="left">{row.device}</TableCell>
                                        <TableCell align="left">{row.status ? 'On' : 'Off'}</TableCell>
                                        <TableCell align="left">
                                            {new Date(row.time).toLocaleDateString()} {/* Displays the date */}
                                            {', '}
                                            {new Date(row.time).toLocaleTimeString()} {/* Displays the time */}
                                            {', '}
                                            {Intl.DateTimeFormat().resolvedOptions().timeZone} {/* Displays the time zone */}
                                        </TableCell>

                                    </TableRow>
                                );
                            })}
                            {/* {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={headCells.length} />
                                </TableRow>
                            )} */}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
