import React, { useCallback, useEffect, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, Switch, MenuItem, RadioGroup, FormControl, FormControlLabel, Radio, DialogActions, DialogTitle } from '@mui/material';
import { FiPrinter } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import axios from '../../../axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from '../SnackbarProvider';
import Swal from 'sweetalert2'
import { styled } from '@mui/material/styles';
import DescriptionCell from './DescriptionCell';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));



const Stories = () => {
    const { openSnackbar } = useSnackbar();
    const router = useRouter()
    const tabNames = ["Normal / Text Stories", "Video Stories"];
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    // Image upload function
    const [uploadedImages, setUploadedImages] = useState([]);
    const [images, setImages] = useState([]);


    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        const newImages = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                newImages.push(file);
                setUploadedImages((prevImages) => [...prevImages, e.target.result]);
                setImages(newImages);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newUploadedImages = [...uploadedImages];
        newUploadedImages.splice(index, 1);
        setUploadedImages(newUploadedImages);
    };


    const [imageStories, setImageStories] = useState([])
    const [videoStories, setVideoStories] = useState([])

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            fetchStoriesData()
        }

        return () => { unmounted = true };
    }, [])

    const fetchStoriesData = useCallback(
        () => {
            axios.get('/api/fetch-all-stories', {
                headers: {
                    Authorization: localStorage.getItem('kardifyAdminToken')
                }
            })
                .then((res) => {
                    if (res.data.status === 'success') {
                        const allStories = res.data.allStories;
                        const imageStories = allStories.filter(story => story.story_type === 'image');
                        const videoStories = allStories.filter(story => story.story_type === 'video');
                        setImageStories(imageStories);
                        setVideoStories(videoStories);
                    } else if (res.data.message === 'Session expired') {
                        router.push('/login')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        [],
    )

    // ----------------------image stories----------------------------------
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const totalRows = imageStories.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRows = imageStories.filter((e) =>
        e.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.Customer.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    // ----------------------video stories----------------------------------
    const [page1, setPage1] = useState(1);
    const rowsPerPage1 = 10;
    const totalRows1 = videoStories.length;
    const totalPages1 = Math.ceil(totalRows1 / rowsPerPage1);

    const handleChangePage1 = (event, newPage) => {
        setPage1(newPage);
    };

    const [searchQuery1, setSearchQuery1] = useState("");

    const filteredRows1 = videoStories.filter((e) =>
        e.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.Customer.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedRows1 = filteredRows1.slice((page1 - 1) * rowsPerPage1, page1 * rowsPerPage1);

    // -----------------video dialog open------------------------------
    const [open, setOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState({})

    const handleOpen = (data) => {
        setOpen(true);
        setSelectedVideo(data)
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedVideo({})
    };




    // ----------------------------------------------Change status section Starts-----------------------------------------------------
    const handleSwitchChange = (data) => {
        axios.post(`/api/update-story-status?story_id=${data.id}`, {}, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        })
            .then(res => {
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStoriesData()
                }
            })
            .catch(err => {
                console.log(err)
            })
    };
    // ----------------------------------------------Change status section Ends-----------------------------------------------------

    // ----------------------------------------------Delete car brands section Starts-----------------------------------------------------
    const deleteStory = (data) => {
        Swal.fire({
            title: "Delete",
            text: `Do you want to Delete this ${data.heading}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Yes! Delete it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/delete-story?story_id=${data.id}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('kardifyAdminToken')
                    }
                })
                    .then(res => {
                        if (res.data.status === 'success') {
                            fetchStoriesData()
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

    // ----------------------------------------------Delete Car brands section Ends-----------------------------------------------------



    const handleApprove = (data) => {
        Swal.fire({
            title: "Approve!!",
            text: `Do you want to Approve this ${data.heading} Story?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#CFAA4C",
            cancelButtonColor: "#d33",
            cancelButtonText: "Close",
            confirmButtonText: "Yes! Approve it"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/approve-story?story_id=${data.id}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('kardifyAdminToken')
                    }
                })
                    .then(res => {
                        if (res.data.status === 'success') {
                            fetchStoriesData()
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
    }



    const [rejectedData, setRejectedData] = useState({})
    const [open1, setOpen1] = useState(false);

    console.log('rejectedData', rejectedData)

    const handleReject = (data) => {
        setOpen1(true);
        setRejectedData(data)
    };
    const handleClose1 = () => {
        setOpen1(false);
        setRejectedData({})
    };

    const [getRejectedReason, setGetRejectedReason] = useState({
        rejected_reason_story: ''
    })

    const getRejectData = (e) => {
        const { value, name } = e.target;

        setGetRejectedReason(() => {
            return {
                ...getRejectedReason,
                [name]: value
            }
        })
    }

    const handleRejectStory = () => {
        if (getRejectedReason.rejected_reason_story === '') {
            openSnackbar('Enter a reason to Reject', 'error');
            return
        }
        axios.post('/api/reject-story', {
            story_id: rejectedData.id,
            rejected_reason: getRejectedReason.rejected_reason_story
        }, {
            headers: {
                Authorization: localStorage.getItem('kardifyAdminToken')
            }
        }).
            then(res => {
                console.log(res)
                if (res.data.status === 'success') {
                    openSnackbar(res.data.message, 'success');
                    fetchStoriesData()
                    handleClose1()
                } else {
                    openSnackbar(res.data.message, 'error');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    return (
        <div className='px-[20px] space-y-3 container mx-auto overflow-y-scroll'>
            <div className=' py-[10px] flex flex-col space-y-5'>
                <div className='flex flex-col space-y-1'>
                    <span className='text-[30px] text-[#101828] font-[500]'>Customer Stories List</span>
                    <span className='text-[#667085] font-[400] text-[16px]'>Effortless Service Coordination: Seamlessly manage your Installer List in the admin application, ensuring prompt and reliable services for product installation post-purchase, enhancing customer satisfaction.</span>
                </div>
            </div>

            <div className="flex">
                {tabNames.map((tabName, index) => (
                    <button
                        key={index}
                        style={{ whiteSpace: 'nowrap' }}
                        className={`px-[30px] py-[8px] w-full tab-btn text-[14px]  border-r-2 border-l-2 border-[#CFAA4C] font-[500] ${activeTab === index ? 'active bg-[#CFAA4C] text-[#fff]' : 'bg-[#FCF8EE]'}`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tabName}
                    </button>
                ))}
            </div>
            <div className="tab-content py-3">
                {tabNames.map((tabName, index) => (
                    <div key={index} className={`tab-pane ${activeTab === index ? 'active' : 'hidden'}`}>
                        {activeTab === index && (
                            <>
                                {tabName === "Normal / Text Stories" && (
                                    <>
                                        <Paper >
                                            <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                                                <Table stickyHeader aria-label="sticky table">
                                                    <TableHead>
                                                        <TableRow className='!bg-[#F9FAFB]'>
                                                            {/* Define your table header columns */}
                                                            <TableCell style={{ minWidth: 100 }}>SL no</TableCell>
                                                            <TableCell style={{ minWidth: 200 }}>Customer Name</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Gender</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Customer Info</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Address</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Pincode</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Story Image</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Heading</TableCell>
                                                            <TableCell style={{ minWidth: 400 }}>Description</TableCell>
                                                            <TableCell style={{ minWidth: 200 }}>Approval Status</TableCell>
                                                            <TableCell style={{ minWidth: 200 }}>Rejected Reason</TableCell>
                                                            <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                                                            <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                                                            {/* <TableCell style={{ minWidth: 50 }}>Print</TableCell>
                                                            <TableCell style={{ minWidth: 50 }}>View</TableCell> */}
                                                        </TableRow>
                                                    </TableHead>
                                                    {filteredRows.length > 0 ?
                                                        <TableBody>
                                                            {paginatedRows.map((row, i) => (
                                                                <TableRow key={i} >
                                                                    <TableCell>{i + 1}</TableCell>
                                                                    <TableCell>
                                                                        {row.Customer.fullname}
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        female
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className='flex flex-col space-y-2 text-[#667085]'>
                                                                            <span className='text-[14px] font-[400]'>{row.Customer.phone}</span>
                                                                            <span className='text-[14px] font-[400]'>{row.Customer.email}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>560098</TableCell>
                                                                    <TableCell>560098</TableCell>
                                                                    <TableCell>
                                                                        <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={100} height={100} alt={row.heading} className='rounded-[8px]' />
                                                                        {/* <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={100} height={100} alt='categroy' className='rounded-[8px]' /> */}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {row.heading}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <DescriptionCell description={row.description} />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {row.is_approved === null && (
                                                                            <div className='flex items-center gap-[15px]'>
                                                                                <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer' onClick={() => handleApprove(row)}>
                                                                                    <span className='text-[#027A48] text-[12px] font-[500]'>Approve</span>
                                                                                </div>
                                                                                <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer' onClick={() => handleReject(row)}>
                                                                                    <span className='text-red-500 text-[12px] font-[500]'>Reject</span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {row.is_approved == 1 && (
                                                                            <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center ' >
                                                                                <span className='text-[#027A48] text-[12px] font-[500]'>Approved</span>
                                                                            </div>
                                                                        )}
                                                                        {row.is_approved == 0 && (
                                                                            <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center '>
                                                                                <span className='text-red-500 text-[12px] font-[500]'>Rejected</span>
                                                                            </div>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {row.is_approved === 0 ? row.rejected_reason : 'N/A'}
                                                                    </TableCell>
                                                                    <TableCell>
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
                                                                            checked={row.status}
                                                                            onChange={() => handleSwitchChange(row)}
                                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                                            disabled={row.is_approved === 0}
                                                                            sx={{
                                                                                '& .MuiSwitch-thumb': {
                                                                                    backgroundColor: row.status ? '#CFAA4C' : '',
                                                                                },
                                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                                    backgroundColor: '#CFAA4C',
                                                                                },
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell><FaRegTrashAlt className='text-[20px] cursor-pointer text-slate-500' onClick={() => deleteStory(row)} /></TableCell>
                                                                    {/* <TableCell><FiPrinter className='text-[20px] cursor-pointer text-slate-500' /></TableCell>
                                                                    <TableCell><FaRegEye className='text-[20px] cursor-pointer text-slate-500' onClick={() => handleViewDetails(row)} /></TableCell> */}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                        :
                                                        <TableRow>
                                                            <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Stories Found</TableCell>
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
                                    </>
                                )}

                                {tabName === "Video Stories" && (
                                    <>
                                        <Paper >
                                            <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                                                <Table stickyHeader aria-label="sticky table">
                                                    <TableHead>
                                                        <TableRow className='!bg-[#F9FAFB]'>
                                                            {/* Define your table header columns */}
                                                            <TableCell style={{ minWidth: 100 }}>SL no</TableCell>
                                                            <TableCell style={{ minWidth: 200 }}>Customer Name</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Gender</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Customer Info</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Address</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Pincode</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Story Image</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Heading</TableCell>
                                                            <TableCell style={{ minWidth: 400 }}>Description</TableCell>
                                                            <TableCell style={{ minWidth: 200 }}>Approval Status</TableCell>
                                                            <TableCell style={{ minWidth: 200 }}>Rejected Reason</TableCell>
                                                            <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                                                            <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                                                            <TableCell style={{ minWidth: 50 }}>Delete</TableCell>
                                                            {/* <TableCell style={{ minWidth: 50 }}>Print</TableCell>
                                                            <TableCell style={{ minWidth: 50 }}>View</TableCell> */}
                                                        </TableRow>
                                                    </TableHead>
                                                    {filteredRows1.length > 0 ?
                                                        <TableBody>
                                                            {paginatedRows1.map((row, i) => (
                                                                <TableRow key={i} >
                                                                    <TableCell>{i + 1}</TableCell>
                                                                    <TableCell>
                                                                        {row.Customer.fullname}
                                                                    </TableCell>
                                                                    <TableCell >
                                                                        male
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className='flex flex-col space-y-2 text-[#667085]'>
                                                                            <span className='text-[14px] font-[400]'>{row.Customer.phone}</span>
                                                                            <span className='text-[14px] font-[400]'>{row.Customer.email}</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>560098</TableCell>
                                                                    <TableCell>560098</TableCell>
                                                                    <TableCell>
                                                                        <>
                                                                            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                                <video src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width='100%' height='100%' alt={row.heading} className='rounded-[8px]' style={{ opacity: 0.5 }} />
                                                                                <IconButton onClick={() => handleOpen(row)} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
                                                                                    <PlayArrowIcon />
                                                                                </IconButton>
                                                                            </div>
                                                                        </>
                                                                        {/* <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={100} height={100} alt='categroy' className='rounded-[8px]' /> */}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {row.heading}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <DescriptionCell description={row.description} />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {row.is_approved === null && (
                                                                            <div className='flex items-center gap-[15px]'>
                                                                                <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center cursor-pointer' onClick={() => handleApprove(row)}>
                                                                                    <span className='text-[#027A48] text-[12px] font-[500]'>Approve</span>
                                                                                </div>
                                                                                <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center cursor-pointer' onClick={() => handleReject(row)}>
                                                                                    <span className='text-red-500 text-[12px] font-[500]'>Reject</span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {row.is_approved == 1 && (
                                                                            <div className='flex items-center px-[10px] py-[5px] bg-[#ECFDF3] rounded-[16px] justify-center' >
                                                                                <span className='text-[#027A48] text-[12px] font-[500]'>Approved</span>
                                                                            </div>
                                                                        )}
                                                                        {row.is_approved == 0 && (
                                                                            <div className='flex items-center px-[10px] py-[5px] bg-red-100 rounded-[16px] justify-center'>
                                                                                <span className='text-red-500 text-[12px] font-[500]'>Rejected</span>
                                                                            </div>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {row.is_approved === 0 ? row.rejected_reason : 'N/A'}
                                                                    </TableCell>
                                                                    <TableCell>
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
                                                                            checked={row.status}
                                                                            onChange={() => handleSwitchChange(row)}
                                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                                            disabled={row.is_approved === 0}
                                                                            sx={{
                                                                                '& .MuiSwitch-thumb': {
                                                                                    backgroundColor: row.status ? '#CFAA4C' : '',
                                                                                },
                                                                                '& .Mui-checked + .MuiSwitch-track': {
                                                                                    backgroundColor: '#CFAA4C',
                                                                                },
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell><FaRegTrashAlt className='text-[20px] cursor-pointer text-slate-500' onClick={() => deleteStory(row)} /></TableCell>
                                                                    {/* <TableCell><FiPrinter className='text-[20px] cursor-pointer text-slate-500' /></TableCell>
                                                                    <TableCell><FaRegEye className='text-[20px] cursor-pointer text-slate-500' onClick={() => handleViewDetails(row)} /></TableCell> */}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                        :
                                                        <TableRow>
                                                            <TableCell colSpan={7} className='text-center text-[15px] font-bold'>No Stories Found</TableCell>
                                                        </TableRow>
                                                    }
                                                </Table>
                                            </TableContainer>
                                        </Paper>

                                        {filteredRows1.length > rowsPerPage1 && (
                                            <div className='flex justify-center mt-3'>
                                                <Pagination
                                                    count={totalPages1}
                                                    page={page1}
                                                    onChange={handleChangePage1}
                                                    shape="rounded"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                            </>
                        )}
                    </div>
                ))}
            </div>

            <Dialog open={open} fullWidth onClose={handleClose}>
                <DialogContent>
                    <IconButton onClick={handleClose} style={{ position: 'absolute', top: 0, right: 5, zIndex: 2 }}>
                        <CloseIcon />
                    </IconButton>
                    <video width='100%' height='100%' controls className='p-[10px]'>
                        <source src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${selectedVideo.image_url}`} type="video/mp4" className='rounded-[8px]' />
                        Your browser does not support the video tag.
                    </video>
                </DialogContent>
            </Dialog>


            {/*---------------------- Reject Stories dialog ------------------------*/}
            <BootstrapDialog
                onClose={handleClose1}
                aria-labelledby="customized-dialog-title"
                open={open1}
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Reject Story
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
                        <span className='text-[#344054] text-[14px] font-[500]'>Reason:</span>
                        <textarea className='inputText !text-[14px]' placeholder='Reason for rejection' name='rejected_reason_story' onChange={getRejectData} />
                    </div>
                </DialogContent>
                <DialogActions className='justify-between'>
                    <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
                        Close
                    </span>
                    <span autoFocus className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70' onClick={handleRejectStory}>
                        Reject Story
                    </span>
                </DialogActions>
            </BootstrapDialog>
        </div>
    )
}

export default Stories