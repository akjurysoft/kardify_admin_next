import React, { useCallback, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination } from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2'
import { MdAdd } from "react-icons/md";
import axios from '../../../axios';
import { useSnackbar } from '../SnackbarProvider';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getProductBrands } from '../api';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const ProductBrands = () => {

  const { openSnackbar } = useSnackbar();


  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchProductBrands()
    }

    return () => { unmounted = true };
  }, [])
  // ----------------------------------------------Fetch Product Brands Starts-----------------------------------------------------

  const [productBrandsData, setProductBrandsData] = useState([])
  const fetchProductBrands = async () => {
    try {
      const productsData = await getProductBrands();
      setProductBrandsData(productsData.brandNames);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // ----------------------------------------------Fetch Product brands Ends-----------------------------------------------------

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = productBrandsData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = productBrandsData.filter((e) =>
    e.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ----------------------------------------------Change status section Starts-----------------------------------------------------
  const handleSwitchChange = (id) => {
    axios.post(`/api/update-product-brand-status?product_brand_id=${id}`, {}, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken')
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          openSnackbar(res.data.message, 'success');
          fetchProductBrands()
        }
      })
      .catch(err => {
        console.log(err)
      })
  };
  // ----------------------------------------------Change status section Ends-----------------------------------------------------

  // ----------------------------------------------Delete car brands section Starts-----------------------------------------------------
  const deleteCategory = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this ${data.brand_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/delete-product-brand?product_brand_id=${data.id}`, {}, {
          headers: {
            Authorization: localStorage.getItem('kardifyAdminToken')
          }
        })
          .then(res => {
            if (res.data.code == 200) {
              fetchProductBrands()
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



  // ------------------------------------------------------Add Product brands section--------------------------------------------------
  // Image uploading section
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(null)

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
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setShowImage(null)
  };

  const [getProductBrandName, setGetProductBrandname] = useState({
    brand_name: ''
  })

  const getData = (e) => {
    const { value, name } = e.target;

    setGetProductBrandname(() => {
      return {
        ...getProductBrandName,
        [name]: value
      }
    })
  }

  const handleAddProductBrand = () => {
    const formData = new FormData();
    formData.append('product_brand_name', getProductBrandName.brand_name);
    formData.append('image', image);

    axios.post('/api/add-product-brands', formData, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        if (res.data.status === 'success') {
          fetchProductBrands()
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

  // ------------------------------------------------------Add Product brands section Ends--------------------------------------------------


  // ------------------------------------------------------Edit Product brands section--------------------------------------------------

  const [getCarBrandNameEdit, setGetCarBrandNameEdit] = useState({
    edit_brand_name: ''
  })

  const getEditData = (e) => {
    const { value, name } = e.target;

    setGetCarBrandNameEdit(() => {
      return {
        ...getCarBrandNameEdit,
        [name]: value
      }
    })
  }

  // Image uploading section
  const [imageEdit, setImageEdit] = useState(null);
  const [showImageEdit, setShowImageEdit] = useState(null)

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

  const [open1, setOpen1] = React.useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };
  const handleClose1 = () => {
    setImageEdit(null);
    setShowImageEdit(null)
    setOpen1(false);
  };

  const [editData, setEditData] = useState({})

  const handleEdit = (data) => {
    setOpen1(true)
    setEditData(data)
  }

  const handleEditProductBrand = () => {
    const formData = new FormData();
    formData.append('product_brand_id', editData.id)
    formData.append('product_brand_name', getCarBrandNameEdit.edit_brand_name || editData.brand_name);
    if (imageEdit) {
      formData.append('image', imageEdit);
    }
    axios.post(`/api/edit-product-brands`, formData, {
      headers: {
        Authorization: localStorage.getItem('kardifyAdminToken'),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          fetchProductBrands()
          openSnackbar(res.data.message, 'success');
          setImageEdit(null)
          setShowImageEdit(null)
          setEditData({})
          setOpen1(false)
        } else {
          openSnackbar(res.data.message, 'error');
        }
      })
      .catch(err => {
        console.log(err)
        openSnackbar(err.response.data.message, 'error');
      })
  }
  // ------------------------------------------------------Edit Product brands section--------------------------------------------------

  return (
    <div className='px-[20px]  container mx-auto overflow-y-scroll'>
      <div className=' py-[10px] flex flex-col space-y-5'>
        <div className='flex flex-col space-y-1'>
          <span className='text-[30px] text-[#101828] font-[500]'>Product Brands</span>
          <span className='text-[#667085] font-[400] text-[16px]'>Simplify Management, Streamline Operations Unleash Efficiency in Admin Applications.</span>
        </div>


        <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
          <div className='flex items-center px-3 justify-between'>
            <div className='flex space-x-2 items-center'>
              <span className='text-[18px] font-[500] text-[#101828]'>Product Brands</span>
              <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{productBrandsData.length} brands</span>
            </div>
            <div className='flex items-center space-x-3 inputText w-[30%]'>
              <IoSearch className='text-[20px]' />
              <input
                type='text'
                className='outline-none focus-none w-full'
                placeholder='Search Product Brand Name Here'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70' onClick={handleClickOpen}>
              <MdAdd className='text-[#fff] text-[16px] font-[600]' />
              <span className=' text-[16px] text-[#fff] font-[600]'>Add New Product Brand</span>
            </div>
          </div>

          {/* Table content here */}
          <Paper >
            <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow className='!bg-[#F9FAFB]'>
                    {/* Define your table header columns */}
                    <TableCell style={{ minWidth: 50 }}>SL no</TableCell>
                    <TableCell style={{ minWidth: 150 }}>Product Brand Image</TableCell>
                    <TableCell style={{ minWidth: 150 }}>Product Brand Name</TableCell>
                    <TableCell style={{ minWidth: 50 }}>Status</TableCell>
                    <TableCell style={{ minWidth: 50 }}>Change Status</TableCell>
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
                          <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${row.image_url}`} width={50} height={40} alt={row.category_name} className='rounded-[8px]' />
                        </TableCell>
                        <TableCell>
                          {row.brand_name}
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

        {/*---------------------- add  Product brands dialog ------------------------*/}
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Add New Product Brand
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
              <span className='text-[#344054] text-[14px] font-[500]'>Product Brand Name</span>
              <input type='text' className='inputText' placeholder='Ex: BMW' name='brand_name' onChange={getData} />
            </div>
            <div className='flex flex-col space-y-2 py-5'>
              <span className='text-[#344054] text-[14px] font-[500]'>Choose Product Brand Image</span>
              <input type='file' accept='image/*' onChange={handleImageChange} />
            </div>

            {showImage && (
              <div className="relative rounded-[8px]">
                <img src={showImage} alt='Uploaded Preview' width='100' className='rounded-[8px]' />
                <span onClick={handleRemoveImage} className="absolute top-[-15px] bg-transparent text-black cursor-pointer">
                  <IoClose />
                </span>
              </div>
            )}
          </DialogContent>
          <DialogActions className='justify-between'>
            <span onClick={handleClose} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
              Cancel
            </span>
            <span autoFocus onClick={handleAddProductBrand} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
              Submit
            </span>
          </DialogActions>
        </BootstrapDialog>


        {/*---------------------- Edit  Car Brands dialog ------------------------*/}
        <BootstrapDialog
          onClose={handleClose1}
          aria-labelledby="customized-dialog-title"
          open={open1}
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Edit Product Brand
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
              <span className='text-[#344054] text-[14px] font-[500]'>Product Brand Name</span>
              <input type='text' defaultValue={editData.brand_name} className='inputText' placeholder='Ex: Colour' name='edit_brand_name' onChange={getEditData} />
            </div>

            <div className='flex flex-col space-y-2 py-5'>
              <span className='text-[#344054] text-[14px] font-[500]'>Choose Product Brand Image</span>
              <input type='file' accept='image/*' onChange={handleImageChangeEdit} />
            </div>

            {editData && (
              <div className="relative rounded-[8px]">
                <img src={showImageEdit || `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${editData.image_url}`} alt='Uploaded Preview' width='100' className='rounded-[8px]' />
                <span onClick={handleRemoveImageEdit} className={`absolute top-[-15px] bg-transparent text-black cursor-pointer ${!showImageEdit ? 'hidden' : 'block'}`}>
                  <IoClose />
                </span>
              </div>
            )}
          </DialogContent>
          <DialogActions className='justify-between'>
            <span onClick={handleClose1} className='px-[18px] py-[10px] border border-[#D0D5DD] rounded-[8px] w-[50%] text-center cursor-pointer'>
              Cancel
            </span>
            <span autoFocus onClick={handleEditProductBrand} className='bg-[#CFAA4C] rounded-[8px] border-[#CFAA4C] w-[50%] py-[10px] text-center cursor-pointer text-[#fff] hover:opacity-70'>
              Save Changes
            </span>
          </DialogActions>
        </BootstrapDialog>

      </div>
    </div>
  )
}

export default ProductBrands