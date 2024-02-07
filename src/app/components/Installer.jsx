import React, { useCallback, useEffect, useState } from 'react'
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import { IoSearch } from 'react-icons/io5';
import { MdAdd } from 'react-icons/md';
import Image from 'next/image';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import axios from '../../../axios';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


const Installer = () => {
    // const { openSnackbar } = useSnackbar();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [open1, setOpen1] = React.useState(false);

    const handleClickOpen1 = () => {
        setOpen1(true);
    };
    const handleClose1 = () => {
        setOpen1(false);
    };


    // ----------------------------------------------Fetch Attribute section Starts-----------------------------------------------------
    const [attributeData, setAttributeData] = useState([])

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchAttributeData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchAttributeData = useCallback(
        () => {
            axios.get('/api/fetch-all-attributes')
                .then((res) => {
                    if (res.data.status === 'success') {
                        setAttributeData(res.data.attributes)
                    }
                })
                .then(err => {
                    console.log(err)
                })
        },
        [],
    )

    // ----------------------------------------------Fetch Attribute section Ends-----------------------------------------------------

    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const totalRows = attributeData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = attributeData.filter((e) =>
        e.attribute_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    // ----------------------------------------------Add Attribute section Starts-----------------------------------------------------

    const [getAttributeName, setGetAttributeName] = useState({
        attribute_name: ''
    })

    const getData = (e) => {
        const { value, name } = e.target;

        setGetAttributeName(() => {
            return {
                ...getAttributeName,
                [name]: value
            }
        })
    }

    const handleAddAttribute = () => {
        const formData = new FormData();
        formData.append('attribute_name', getAttributeName.attribute_name);

        axios.post('/api/add-attributes', formData)
            .then(res => {
                if (res.data.status === 'success') {
                    fetchAttributeData()
                    openSnackbar(res.data.message, 'success');
                    handleClose()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
                openSnackbar(err.response.data.message, 'error');
            })
    }

    // ----------------------------------------------Add Attribute section Ends-------------------------------------------------------


    // ----------------------------------------------Change status section Starts-----------------------------------------------------
    const handleSwitchChange = (id) => {
        axios.post(`/api/update-attribute-status?attribute_id=${id}`)
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchAttributeData()
                }
            })
            .catch(err => {
                console.log(err)
            })
    };
    // ----------------------------------------------Change status section Ends-----------------------------------------------------
    // ----------------------------------------------Delete Attribute section Starts-----------------------------------------------------
    const deleteCategory = (data) => {
        Swal.fire({
            title: "Delete",
            text: `Do you want to Delete this ${data.attribute_name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Delete it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/delete-attributes?attribute_id=${data.id}`)
                    .then(res => {
                        if (res.data.code == 200) {
                            fetchAttributeData()
                            openSnackbar(res.data.message, 'success');
                            if (page > 1 && paginatedRows.length === 1) {
                                setPage(page - 1);
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        });
    };

    // ----------------------------------------------Delete Attribute section Ends-----------------------------------------------------

    const [isEditable, setIsEditable] = useState(false)
    const [editData, setEditData] = useState({})
    const handleEdit = (data) => {
        setEditData(data)
        handleClickOpen1()
        setIsEditable(true)
    }

    const [getEditedAttributeName, setGetEditedAttributeName] = useState({
        attribute_name_edit: ''
    })

    const getDataEdit = (e) => {
        const { value, name } = e.target;

        setGetEditedAttributeName(() => {
            return {
                ...getEditedAttributeName,
                [name]: value
            }
        })
    }

    const handleUpdateAttribute = () => {
        axios.post('/api/edit-attributes', {
            attribute_id: editData.id,
            attribute_name: getEditedAttributeName.attribute_name_edit ? getEditedAttributeName.attribute_name_edit : editData.attribute_name
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchAttributeData()
                    setGetEditedAttributeName({})
                    handleClose1()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const returnMain = () => {
        setIsEditable(false)
        setEditData({})
    }


    return (
        <div className='px-[20px]  container mx-auto overflow-y-scroll'>
            <div className=' py-[10px] flex flex-col space-y-5'>
                <div className='flex flex-col space-y-1'>
                    <span className='text-[30px] text-[#101828] font-[500]'>Installer List</span>
                    <span className='text-[#667085] font-[400] text-[16px]'>Effortless Service Coordination: Seamlessly manage your Installer List in the admin application, ensuring prompt and reliable services for product installation post-purchase, enhancing customer satisfaction.</span>
                </div>
            </div>

            <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
                <div className='flex items-center px-3 justify-between'>
                    <div className='flex space-x-2 items-center'>
                        <span className='text-[18px] font-[500] text-[#101828]'>Installer List</span>
                        <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{attributeData.length} Installer</span>
                    </div>
                    <div className='flex items-center space-x-3 inputText'>
                        <IoSearch className='text-[20px]' />
                        <input
                            type='text'
                            className='outline-none focus-none'
                            placeholder='Search here'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70'>
                        <MdAdd className='text-[#fff] text-[16px] font-[600]' />
                        <span className=' text-[16px] text-[#fff] font-[600]' onClick={handleClickOpen}>Add New Installer</span>
                    </div>
                </div>

                {/* Table content here */}
                <Paper >
                    <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow className='!bg-[#F9FAFB]'>
                                    {/* Define your table header columns */}
                                    <TableCell style={{ minWidth: 100 }}>SL no</TableCell>
                                    <TableCell style={{ minWidth: 150 }}>Installer ID</TableCell>
                                    <TableCell style={{ minWidth: 150 }}>Installer Name</TableCell>
                                    <TableCell style={{ minWidth: 150 }}>Installer info</TableCell>
                                    <TableCell style={{ minWidth: 150 }}>Company Name</TableCell>
                                    <TableCell style={{ minWidth: 250 }}>Company Address</TableCell>
                                    <TableCell style={{ minWidth: 150 }}>City</TableCell>
                                    <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                                    <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                                    <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                                    <TableCell style={{ minWidth: 50 }}>Edit</TableCell>
                                </TableRow>
                            </TableHead>
                            {filteredRows.length > 0 ?
                                <TableBody>
                                    {paginatedRows.map((row) => (
                                        <TableRow key={row.id} >
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell className='text-[#667085]'>
                                                546464
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex items-center space-x-2 text-[#667085]' >
                                                    <Image src='/images/logo.svg' alt='installer' width={30} height={50} className='rounded-[50%] object-cover h-[40px] w-[40px]'/>
                                                    <span>Subham</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className='flex flex-col space-y-2 text-[#667085]'>
                                                    <span className='text-[14px] font-[400]'>+ 91 97575 87868</span>
                                                    <span className='text-[14px] font-[400]'>olivia@untitledui.com</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className='text-[#667085]'>
                                                Kardify
                                            </TableCell>
                                            <TableCell className='text-[#667085]'>
                                                Mission Rd, Sampangi Rama Nagara, Bengaluru, Karnataka 560027
                                            </TableCell>
                                            <TableCell className='text-[#667085]'>
                                                Bengaluru
                                            </TableCell>
                                            <TableCell >
                                                {row.status === 1 ?
                                                    <div className='flex items-center gap-[5px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center'>
                                                        <Image src="/images/active.svg" height={10} width={10} alt='active' />
                                                        <span className='text-[#027A48] text-[12px] font-[500]'>Active</span>
                                                    </div> :
                                                    <div className='flex items-center gap-[5px] py-[5px] bg-red-200 rounded-[16px] justify-center'>
                                                        <Image src="/images/inactive.svg" height={10} width={10} alt='active' />
                                                        <span className='text-red-500 text-[12px] font-[500]'>Inactive</span>
                                                    </div>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={row.status === 1}
                                                    onChange={() => handleSwitchChange(row.id)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                    sx={{
                                                        '& .MuiSwitch-thumb': {
                                                            backgroundColor: row.status === 1 ? '#CFAA4C' : '',
                                                        },
                                                        '& .Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#CFAA4C',
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell ><FaRegTrashAlt className='cursor-pointer' onClick={() => deleteCategory(row)} /></TableCell>
                                            <TableCell><FaEdit className='cursor-pointer' onClick={() => handleEdit(row)} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                :
                                <TableRow>
                                    <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No product found</TableCell>
                                </TableRow>
                            }
                        </Table>
                    </TableContainer>
                </Paper>

                {filteredRows.length > rowsPerPage && (
                    <div className='flex justify-center mt-3'>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handleChangePage}
                            shape="rounded"
                        />
                    </div>
                )}
            </div>

            {/*---------------------- add  attribute dialog ------------------------*/}
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Add New Installer
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div className='flex flex-col space-y-2'>
                        <span className='text-[#344054] text-[14px] font-[500]'>Attribute Name</span>
                        <input type='text' className='inputText' placeholder='Ex: Colour' name='attribute_name' onChange={getData} />
                    </div>
                </DialogContent>
                <DialogActions className='justify-between'>
                    <span onClick={handleClose} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                        Cancel
                    </span>
                    <span autoFocus onClick={handleAddAttribute} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
                        Submit
                    </span>
                </DialogActions>
            </BootstrapDialog>

            {/*---------------------- Edit  attribute dialog ------------------------*/}
            <BootstrapDialog
                onClose={handleClose1}
                aria-labelledby="customized-dialog-title"
                open={open1}
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Edit Product Attributes
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose1}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div className='flex flex-col space-y-2'>
                        <span className='text-[#344054] text-[14px] font-[500]'>Attribute Name</span>
                        <input type='text' className='inputText' defaultValue={editData.attribute_name} placeholder='Ex: Colour' name='attribute_name_edit' onChange={getDataEdit} />
                    </div>
                </DialogContent>
                <DialogActions className='justify-between'>
                    <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                        Cancel
                    </span>
                    <span autoFocus onClick={handleUpdateAttribute} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
                        Save Changes
                    </span>
                </DialogActions>
            </BootstrapDialog>
        </div>
    )
}

export default Installer