import React, { useCallback, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2'
import axios from '../../../axios';
import { useSnackbar } from '../snackbarProvider';
import { useRouter } from 'next/navigation';

const SubCategory = () => {
  const { openSnackbar } = useSnackbar();
  const router = useRouter()
  const [editData, setEditData] = useState({})


  // ----------------------------------------------Fetch Category section Starts-----------------------------------------------------
  const [categoryData, setCategoryData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCategoryData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchCategoryData = useCallback(
    () => {
      axios.get("/api/fetch-categories",{
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setCategoryData(res.data.categories)
          } else if(res.data.code === 400){
            router.push('/login')
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Category section Ends-----------------------------------------------------

  // ----------------------------------------------Fetch Sub Category section Starts-----------------------------------------------------
  const [subCategoryData, setSubCategoryData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchSubCategoryData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchSubCategoryData = useCallback(
    () => {
      axios.get("/api/fetch-subcategories",{
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          console.log(res.data)
          if (res.data.code == 200) {
            setSubCategoryData(res.data.subcategories)
          } else if(res.data.message === 'Session expired' || res.data.code == 401){
            openSnackbar(res.data.message, 'error');
            router.push('/login')
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Sub Category section Ends-----------------------------------------------------

  // ----------------------------------------------Add subCategory section Starts-----------------------------------------------------
  const [getSubCategoryName, setGetSubCategoryName] = useState({
    sub_category_name: '',
    category_id: '',
    editSubCategoryName: ''
  })

  const getData = (e) => {
    const { value, name } = e.target;

    setGetSubCategoryName(() => {
      return {
        ...getSubCategoryName,
        [name]: value
      }
    })
  }

  // Image uploading section
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(file);
        setShowImage(e.target.result)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setShowImage(null)
  };

  const handleAddSubCategory = () => {
    const formData = new FormData();
    formData.append('sub_category_name', getSubCategoryName.sub_category_name);
    formData.append('category_id', getSubCategoryName.category_id);
    formData.append('image', image);

    axios.post('/api/add-subcategories', formData, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        if (res.data.status === 'success') {
          fetchSubCategoryData()
          openSnackbar(res.data.message, 'success');
          setImage(null)
          setShowImage(null)
          setGetSubCategoryName({})
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
        openSnackbar(err.response.data.message, 'error');
      })
  }

  // ----------------------------------------------Add subCategory section Ends-----------------------------------------------------


  // ----------------------------------------------Pagination and Search Query section Starts-----------------------------------------------------
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalRows = subCategoryData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = subCategoryData.filter((e) =>
    e.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ----------------------------------------------Pagination and Search Query section Ends-----------------------------------------------------


  // ----------------------------------------------Change status section Starts-----------------------------------------------------
  const handleSwitchChange = (id) => {
    axios.post(`/api/update-subcategory-status?sub_category_id=${id}`,{},{
      headers:{
        Authorization: localStorage.getItem('kardifyAdminToken')
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchSubCategoryData()
        }
      })
      .catch(err => {
        console.log(err)
      })
  };
  // ----------------------------------------------Change status section Ends-----------------------------------------------------


  // ----------------------------------------------Delete Sub Category section Starts-----------------------------------------------------
  const deleteCategory = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this ${data.sub_category_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-subcategories?sub_category_id=${data.id}`,{},{
          headers:{
            Authorization: localStorage.getItem('kardifyAdminToken')
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              fetchSubCategoryData()
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

  // ----------------------------------------------Delete Sub Category section Starts-----------------------------------------------------

  const [isEditable, setIsEditable] = useState(false)

  const handleEdit = (data) => {
    console.log(data)
    setEditData(data)
    setIsEditable(true)
  }

  const handleUpdateSubCategory = () => {
    const formData = new FormData();
    formData.append('category_id', editData.category_id)
    formData.append('sub_category_id', editData.id)
    formData.append('sub_category_name', getSubCategoryName.editSubCategoryName || editData.sub_category_name);
    formData.append('image', image);
    axios.post(`/api/update-subcategories`, formData, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          fetchSubCategoryData()
          openSnackbar(res.data.message, 'success');
          setImage(null)
          setShowImage(null)
          setEditData({})
          setIsEditable(false)
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
        openSnackbar(err.response.data.message, 'error');
      })

  }

  const returnMain = () => {
    setIsEditable(false)
    setEditData({})
  }
  return (
    <>
      <div className='px-[20px]  container mx-auto w-[100%] overflow-hidden'>
        {!isEditable ?
          <div className=' py-[10px] flex flex-col space-y-5'>
            <div className='flex flex-col space-y-1'>
              <span className='text-[30px] text-[#101828] font-[500]'>Sub Category Setup</span>
              <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your product offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span>
            </div>

            <div className='flex items-center justify-between gap-[10px]'>
              <div className='flex flex-col space-y-1 w-full'>
                <span>Select Category Name *</span>
                <select name='category_id' onChange={getData}>
                  <option>Choose Category</option>
                  {categoryData && categoryData.filter(e => e.status).map((e, i) =>
                    <option key={i} value={e.id}>{e.category_name}</option>
                  )}
                </select>
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span>Sub Category Name *</span>
                <input type='text' placeholder='Horn' className='inputText' name='sub_category_name' onChange={getData} />
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span>Sub Category Image *</span>
                <input type='file' accept='image/*' onChange={handleImageChange} />
              </div>

              {showImage && (
                <div className="relative bg-[#D8C7B6] rounded-[8px]">
                  <img src={showImage} alt='Uploaded Preview' width='200' className='rounded-[8px]' />
                  <span onClick={handleRemoveImage} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                    <IoClose />
                  </span>
                </div>
              )}
            </div>

            <div className='flex items-center gap-[24px] justify-end'>
              <span className='resetButton'>Reset</span>
              <span className='submitButton' onClick={handleAddSubCategory}>Submit</span>
            </div>

            <div className='flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]'>
              <div className='flex items-center justify-between'>
                <div className='flex space-x-2 items-center'>
                  <span className='text-[18px] font-[500] text-[#101828]'>Sub Category Table</span>
                  <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{subCategoryData.length} Sub Category</span>
                </div>
                <div className='flex items-center space-x-3 inputText w-[50%]'>
                  <IoSearch className='text-[20px]' />
                  <input
                    type='text'
                    className='outline-none focus-none w-full'
                    placeholder='Search Sub category name here'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Table content here */}
              {/* <div style={{ height: '400px', overflowY: 'auto' }}>  */}
              <TableContainer >
                <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 400 }}>
                  <TableHead>
                    <TableRow className='!bg-[#F9FAFB]'>
                      {/* Define your table header columns */}
                      <TableCell style={{ minWidth: 80 }}>SL no</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Category image</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Category Name</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Sub Category image</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Sub Category Name</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Status</TableCell>
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
                          <TableCell>
                            <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.category.image_url}`} width={30} height={30} alt={row.category.category_name} className='rounded-[8px]' />
                          </TableCell>
                          <TableCell>{row.category.category_name}</TableCell>
                          <TableCell>
                            <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={30} height={30} alt={row.sub_category_name} className='rounded-[8px]' />
                          </TableCell>
                          <TableCell>{row.sub_category_name}</TableCell>
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
              {/* </div> */}
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
          :

          <div className=' py-[10px] flex flex-col space-y-5'>
            <div className='flex flex-col space-y-1'>
              <span className='text-[30px] text-[#101828] font-[500]'>Category Setup</span>
              <span className='text-[#667085] font-[400] text-[16px]'>Effortlessly organize your product offerings with intuitive Category Setup for a seamless and structured e-commerce experience.</span>
            </div>
            <div className='flex items-center justify-between gap-[10px]'>
              <div className='flex flex-col space-y-1 w-full'>
                <span>Select Category Name *</span>
                <select value={editData.category_id} disabled onChange={getData}>
                  <option>Choose Category</option>
                  {categoryData && categoryData.map((e, i) =>
                    <option key={i} value={e.id}>{e.category_name}</option>
                  )}
                </select>
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span>Sub Category Name *</span>
                <input type='text' placeholder='Horn' className='inputText' name='editSubCategoryName' onChange={getData} defaultValue={editData.sub_category_name} />
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span>Sub Category Image *</span>
                <input type='file' accept='image/*' defaultValue={editData.image_url} onChange={handleImageChange} />
              </div>
              {showImage && (
                <div className="relative bg-[#D8C7B6] rounded-[8px]">
                  <img src={showImage} alt='Uploaded Preview' width='200' className='rounded-[8px]' />
                  <span onClick={handleRemoveImage} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                    <IoClose />
                  </span>
                </div>
              )}
            </div>


            <div className='flex items-center gap-[24px] justify-end'>
              <span className='resetButton' onClick={returnMain}>Back</span>
              <span className='submitButton' onClick={handleUpdateSubCategory}>Update</span>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default SubCategory