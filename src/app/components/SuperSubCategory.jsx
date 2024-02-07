import React, { useCallback, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2'
import { useSnackbar } from '../snackbarProvider';
import axios from '../../../axios';

const SuperSubCategory = () => {
  const { openSnackbar } = useSnackbar();
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
      axios.get("/api/fetch-categories", {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          if (res.data.code == 200) {
            setCategoryData(res.data.categories)
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
      axios.get("/api/fetch-subcategories", {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          console.log(res.data)
          if (res.data.code == 200) {
            setSubCategoryData(res.data.subcategories)
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Sub Category section Ends-----------------------------------------------------


  // ----------------------------------------------Fetch Super Sub Category section Starts-----------------------------------------------------
  const [superSubCategoryData, setSuperSubCategoryData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchSuperSubCategoryData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchSuperSubCategoryData = useCallback(
    () => {
      axios.get("/api/fetch-supersubcategories", {
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
        .then((res) => {
          console.log(res.data)
          if (res.data.status === 'success') {
            setSuperSubCategoryData(res.data.superSubcategories)
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Super Sub Category section Ends-----------------------------------------------------

  // ----------------------------------------------Add superSubCategory section Starts-----------------------------------------------------
  const [getSuperSubCategoryName, setGetSuperSubCategoryName] = useState({
    sub_category_id: '',
    category_id: '',
    super_sub_category_name: ''
  })

  const getData = (e) => {
    const { value, name } = e.target;

    setGetSuperSubCategoryName(() => {
      return {
        ...getSuperSubCategoryName,
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

  const handleAddSuperSubCategory = () => {
    const formData = new FormData();
    formData.append('sub_category_id', getSuperSubCategoryName.sub_category_id);
    formData.append('category_id', getSuperSubCategoryName.category_id);
    formData.append('super_sub_category_name', getSuperSubCategoryName.super_sub_category_name)
    formData.append('image', image);

    axios.post('/api/add-supersubcategory', formData, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        if (res.data.status === 'success') {
          fetchSuperSubCategoryData()
          openSnackbar(res.data.message, 'success');
          setImage(null)
          setShowImage(null)
          setGetSuperSubCategoryName({})
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
        openSnackbar(err.response.data.message, 'error');
      })
  }

  // ----------------------------------------------Add superSubCategory section Ends-----------------------------------------------------

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalRows = superSubCategoryData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = superSubCategoryData.filter((e) =>
    e.super_sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ----------------------------------------------Change status section Starts-----------------------------------------------------
  const handleSwitchChange = (id) => {
    axios.post(`/api/update-supersubcategory-status?super_sub_category_id=${id}`, {}, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken')
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchSuperSubCategoryData()
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
      text: `Do you want to Delete this ${data.super_sub_category_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-supersubcategories?super_sub_category_id=${data.id}`, {}, {
          headers: {
            Authorization: localStorage.getItem('kardifyAdminToken')
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              fetchSuperSubCategoryData()
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

  // ----------------------------------------------Delete Sub Category section Ends-----------------------------------------------------

  const [isEditable, setIsEditable] = useState(false)
  const [editData, setEditData] = useState({})
  const handleEdit = (data) => {
    setEditData(data)
    setIsEditable(true)
  }

  const [getUpdateSuperSubCategoryData, setGetUpdateSuperSubCategoryData] = useState({
    category_id_edit: '',
    sub_category_id_edit: '',
    super_sub_category_name_edit: '',
  })

  const getDataForUpdate = (e) => {
    const { value, name } = e.target;

    setGetUpdateSuperSubCategoryData(() => {
      return {
        ...getUpdateSuperSubCategoryData,
        [name]: value
      }
    })
  }

  // Image uploading section
  const [imageEdit, setImageEdit] = useState(null);
  const [showImageEdit, setShowImageEdit] = useState(null);

  const handleImageChangeEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageEdit(file);
        setShowImageEdit(e.target.result)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImageEdit = () => {
    setImageEdit(null);
    setShowImageEdit(null)
  };

  const handleUpdateSuperSubCategory = () => {
    const formData = new FormData();
    formData.append('super_sub_category_name', getUpdateSuperSubCategoryData.super_sub_category_name_edit);
    formData.append('super_sub_category_id', editData.id)
    formData.append('image', imageEdit);
    axios.post(`/api/edit-super-subcategory`, formData, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          fetchSuperSubCategoryData()
          openSnackbar(res.data.message, 'success');
          setImageEdit(null)
          setShowImageEdit(null)
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
      <div className='px-[20px]  container mx-auto w-[100%] overflow-scroll'>
        {!isEditable ?
          <div className=' py-[10px] flex flex-col space-y-5'>
            <div className='flex flex-col space-y-1'>
              <span className='text-[30px] text-[#101828] font-[500]'>Super Sub Category Setup</span>
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
                <select name='sub_category_id' onChange={getData}>
                  <option>Choose Sub Category</option>
                  {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                    <option key={i} value={e.id}>{e.sub_category_name}</option>
                  )}
                </select>
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span>Super Sub Category Name *</span>
                <input type='text' placeholder='Horn' className='inputText' name='super_sub_category_name' onChange={getData} />
              </div>


            </div>

            <div className='flex items-end gap-[24px] justify-between'>
              <div className='flex items-end gap-[10px]'>
                <div className='flex flex-col space-y-1 '>
                  <span>Sub Category Image *</span>
                  <input type='file' accept='image/*' onChange={handleImageChange} />
                </div>

                {showImage && (
                  <div className="relative bg-[#D8C7B6] rounded-[8px]">
                    <img src={showImage} alt='Uploaded Preview' width='100' className='rounded-[8px]' />
                    <span onClick={handleRemoveImage} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                      <IoClose />
                    </span>
                  </div>
                )}
              </div>
              <div className='flex items-center gap-[24px]'>
                <span className='resetButton'>Reset</span>
                <span className='submitButton' onClick={handleAddSuperSubCategory}>Submit</span>
              </div>
            </div>

            <div className='flex flex-col space-y-1 border border-[#EAECF0] rounded-[8px] p-[10px]'>
              <div className='flex items-center justify-between'>
                <div className='flex space-x-2 items-center'>
                  <span className='text-[18px] font-[500] text-[#101828]'>Super Sub Category Table</span>
                  <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{superSubCategoryData.length} Super Sub Category</span>
                </div>
                <div className='flex items-center space-x-3 inputText w-[50%]'>
                  <IoSearch className='text-[20px]' />
                  <input
                    type='text'
                    className='outline-none focus-none w-full'
                    placeholder='Search Super SubCategory Name here'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Table content here */}
              {/* <Paper > */}
              <TableContainer >
                <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 450 }}>
                  <TableHead>
                    <TableRow className='!bg-[#F9FAFB]'>
                      {/* Define your table header columns */}
                      <TableCell style={{ minWidth: 100 }}>SL no</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Category image</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Category Name</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Sub Category image</TableCell>
                      <TableCell style={{ minWidth: 200 }}>Sub Category Name</TableCell>
                      <TableCell style={{ minWidth: 250 }}>Super Sub Category image</TableCell>
                      <TableCell style={{ minWidth: 250 }}>Super Sub Category Name</TableCell>
                      <TableCell style={{ minWidth: 100 }}>Status</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Change Status</TableCell>
                      <TableCell style={{ minWidth: 100 }}>Delete</TableCell>
                      <TableCell style={{ minWidth: 100 }}>Edit</TableCell>
                    </TableRow>
                  </TableHead>
                  {filteredRows.length > 0 ?
                    <TableBody>
                      {paginatedRows.map((row) => (
                        <TableRow key={row.id} >
                          <TableCell>{row.id}</TableCell>
                          <TableCell style={{ minWidth: '100' }}>
                            <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.category?.image_url}`} width={30} height={30} alt={row.category?.category_name} className='rounded-[8px]' />
                          </TableCell>
                          <TableCell>{row.category?.category_name}</TableCell>
                          <TableCell>
                            <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.subCategory?.image_url}`} width={30} height={30} alt={row.subCategory?.sub_category_name} className='rounded-[8px]' />
                          </TableCell>
                          <TableCell>{row.subCategory?.sub_category_name}</TableCell>
                          <TableCell>
                            <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={30} height={30} alt={row.super_sub_category_name} className='rounded-[8px]' />
                          </TableCell>
                          <TableCell>{row.super_sub_category_name}</TableCell>
                          <TableCell >
                            {row.status ?
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
                              onChange={() => handleSwitchChange(row.id)}
                              inputProps={{ 'aria-label': 'controlled' }}
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
              {/* </Paper> */}

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
                <select id="category_id_edit" value={editData.category_id} disabled name='category_id_edit' onChange={getDataForUpdate}>
                  <option>Choose Category</option>
                  {categoryData && categoryData.filter(e => e.status).map((e, i) =>
                    <option key={i} value={e.id}>{e.category_name}</option>
                  )}
                </select>
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span>Sub Category Name *</span>
                <select id='sub_category_id_edit' value={editData.sub_category_id} disabled name='sub_category_id_edit' onChange={getDataForUpdate}>
                  <option>Choose Sub Category</option>
                  {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                    <option key={i} value={e.id}>{e.sub_category_name}</option>
                  )}
                </select>
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span>Super Sub Category Name *</span>
                <input id='super_sub_category_name_edit' type='text' placeholder='Horn' defaultValue={editData.super_sub_category_name} className='inputText' name='super_sub_category_name_edit' onChange={getDataForUpdate} />
              </div>


            </div>

            <div className='flex items-end gap-[24px] justify-between'>
              <div className='flex items-end gap-[10px]'>
                <div className='flex flex-col space-y-1 '>
                  <span>Sub Category Image *</span>
                  <input id='imageEdit' type='file' accept='image/*' onChange={handleImageChangeEdit} />
                </div>

                {showImageEdit && (
                  <div className="relative bg-[#D8C7B6] rounded-[8px]">
                    <img src={showImageEdit} alt='Uploaded Preview' width='100' className='rounded-[8px]' />
                    <span onClick={handleRemoveImageEdit} className="absolute top-[-15px] right-0 bg-transparent text-black cursor-pointer">
                      <IoClose />
                    </span>
                  </div>
                )}
              </div>
              <div className='flex items-center gap-[24px]'>
                <span className='resetButton' onClick={returnMain}>Reset</span>
                <span className='submitButton' onClick={handleUpdateSuperSubCategory}>Update</span>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default SuperSubCategory