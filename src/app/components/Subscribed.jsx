import React, { useCallback, useEffect, useState } from 'react'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import { FaRegEye, FaRegTrashAlt } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import axios from '../../../axios';
import Swal from 'sweetalert2'


const Subscribed = () => {
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

    // ----------------------------------------------Delete Attribute section Starts-----------------------------------------------------
    const deleteSubscribed = (data) => {
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


    return (
        <div className='px-[20px]  container mx-auto overflow-y-scroll'>
            <div className=' py-[10px] flex flex-col space-y-5'>
                <div className='flex flex-col space-y-1'>
                    <span className='text-[30px] text-[#101828] font-[500]'>Subscribed Customers List</span>
                    <span className='text-[#667085] font-[400] text-[16px]'>Elevate Customer Engagement: Harness the potential of the Subscribed Customers List in the admin application to personalize interactions, drive targeted marketing campaigns, and foster lasting connections with your loyal audience.</span>
                </div>
            </div>
            <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
                <div className='flex items-center px-3 justify-between'>
                    <div className='flex space-x-2 items-center'>
                        <span className='text-[18px] font-[500] text-[#101828]'>Subscribed Customers List</span>
                        <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{attributeData.length} Subscribed Customers</span>
                    </div>
                    <div className='flex items-center space-x-3 inputText w-[50%]'>
                        <IoSearch className='text-[20px]' />
                        <input
                            type='text'
                            className='outline-none focus-none w-full'
                            placeholder='Search by Name/Email/Phone'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70'>
                        <MdAdd className='text-[#fff] text-[16px] font-[600]' />
                        <span className=' text-[16px] text-[#fff] font-[600]' onClick={handleClickOpen}>Add New Installer</span>
                    </div> */}
                </div>

                {/* Table content here */}
                <Paper >
                    <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow className='!bg-[#F9FAFB]'>
                                    {/* Define your table header columns */}
                                    <TableCell>SL no</TableCell>
                                    <TableCell >Email Id</TableCell>
                                    <TableCell >Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            {filteredRows.length > 0 ?
                                <TableBody>
                                    {paginatedRows.map((row) => (
                                        <TableRow key={row.id} >
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell className='text-[#667085]'>
                                                subham.kj@jurysoft.com
                                            </TableCell>
                                            <TableCell ><FaRegTrashAlt className='text-[20px] cursor-pointer text-slate-500' onClick={() => deleteSubscribed(row)} /></TableCell>
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
        </div>
    )
}

export default Subscribed