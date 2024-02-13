import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, TextField } from '@mui/material';
import Image from 'next/image';
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdAdd } from 'react-icons/md';
import axios from '../../../axios';
import { getCategories, getProducts, getSubCategories, getSuperSubCategories } from '../api';
import { Autocomplete, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Banners = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleProductChange = (event, value) => {
    setSelectedProducts(value);
  };

  const [itemType, setItemType] = useState('');

  const [getAllProducts, setGetAllProducts1] = useState([])
  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setGetAllProducts1(productsData.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = getAllProducts.filter(product => product.status === 1);

  const [getAllCategories, setGetAllCategories] = useState([])
  const fetchCategory = async () => {
    try {
      const categoryData = await getCategories();
      setGetAllCategories(categoryData.categories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const [getAllSubCategories, setGetAllSubCategories] = useState([])
  const fetchSubCategory = async () => {
    try {
      const subCatgeoryData = await getSubCategories();
      setGetAllSubCategories(subCatgeoryData.subcategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const [getAllSuperSubCategories, setGetAllSuperSubCategories] = useState([])
  const fetchSuperSubCategory = async () => {
    try {
      const superSubCategoryData = await getSuperSubCategories();
      setGetAllSuperSubCategories(superSubCategoryData.superSubcategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };




  // Image upload function
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [images, setImages] = useState([]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

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


  // ----------------------------------------------Fetch Attribute section Starts-----------------------------------------------------
  const [attributeData, setAttributeData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchAttributeData()
      fetchProducts()
      fetchCategory()
      fetchSubCategory()
      fetchSuperSubCategory()
    }

    return () => { unmounted = true };
  }, [])

  const fetchAttributeData = useCallback(
    () => {
      axios.get('/api/fetch-all-attributes',{
        headers: {
          Authorization: localStorage.getItem('kardifyAdminToken')
        }
      })
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

  const [isEditable, setIsEditable] = useState(false)
  const [editData, setEditData] = useState({})

  const handleEdit = (data) => {
    setEditData(data)
    setIsEditable(true)
  }

  const resetButton = () => {
    setIsEditable(false)
    fetchProducts()
  }

  return (
    <div className='px-[20px]  container mx-auto overflow-y-scroll'>
      {!isEditable ?
        <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Banners Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Elevate Visual Impact with Intuitive Banner Configuration in Admin Applications.</span>
          </div>

          <div className='grid grid-cols-3 gap-4 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Title *</span>
              <input type='text' placeholder='Enter Here' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Item Type *</span>
              <select onChange={(e) => setItemType(e.target.value)}>
                <option>Choose Item Type</option>
                <option>Products</option>
                <option>Category</option>
              </select>
            </div>
            {itemType === 'Category' && (
              <>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Select Category *</span>
                  <select name='category_id' >
                    <option>Choose Category</option>
                    {getAllCategories && getAllCategories.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.category_name}</option>
                    )}
                  </select>
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Select Sub Category *</span>
                  <select name='category_id' >
                    <option>Choose Sub Category</option>
                    {getAllSubCategories && getAllSubCategories.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.sub_category_name}</option>
                    )}
                  </select>
                </div>
                <div className='flex flex-col space-y-1 w-full'>
                  <span>Select Super Sub Category *</span>
                  <select name='category_id' >
                    <option>Choose Super Sub Category</option>
                    {getAllSuperSubCategories && getAllSuperSubCategories.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.super_sub_category_name}</option>
                    )}
                  </select>
                </div>
              </>
            )}
            {itemType === 'Products' && (
              <div className='flex flex-col space-y-1 w-full'>
                <span>Select Product </span>
                <FormControl fullWidth>
                <Autocomplete
                  multiple
                  options={filteredProducts}
                  getOptionLabel={(option) => option.product_name}
                  value={selectedProducts}
                  onChange={handleProductChange}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox color="primary" checked={selected} />
                      {option.product_name}
                    </li>
                  )}
                  style={{ width: '100%' }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Products"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
              </div>
            )}
          </div>

          <div className='flex items-center justify-between gap-[30px]'>
            <div className='flex flex-col space-y-2  w-[100%]'>
              <span className='text-[18px] font-[600]'>Website banner</span>
              <div className="flex flex-col items-center justify-center text-[16px]">
                <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                  <div className="text-[40px]">
                    <FaCloudUploadAlt />
                  </div>
                  <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                  <span className="mt-2 text-[10px] font-bold">OR</span>
                  <button
                    className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                    onClick={handleButtonClick}
                  >
                    Click to Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept='image/*'
                  />
                </div>
                <div className="flex flex-wrap items-center mt-3">
                  {uploadedImages.map((imageDataUrl, index) => (
                    <div key={index} className="p-2 relative">
                      <img src={imageDataUrl} alt={`Uploaded ${index + 1}`} className="max-w-[80px] max-h-[80px]" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        onClick={() => handleImageRemove(index)}
                      >
                        <FaTimes className='text-[10px]' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex flex-col space-y-2  w-[100%]'>
              <span className='text-[18px] font-[600]'>Mobile banner</span>
              <div className="flex flex-col items-center justify-center text-[16px]">
                <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                  <div className="text-[40px]">
                    <FaCloudUploadAlt />
                  </div>
                  <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                  <span className="mt-2 text-[10px] font-bold">OR</span>
                  <button
                    className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                    onClick={handleButtonClick}
                  >
                    Click to Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept='image/*'
                  />
                </div>
                <div className="flex flex-wrap items-center mt-3">
                  {uploadedImages.map((imageDataUrl, index) => (
                    <div key={index} className="p-2 relative">
                      <img src={imageDataUrl} alt={`Uploaded ${index + 1}`} className="max-w-[80px] max-h-[80px]" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        onClick={() => handleImageRemove(index)}
                      >
                        <FaTimes className='text-[10px]' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton'>Reset</span>
            <span className='submitButton'>Submit</span>
          </div>


          <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
            <div className='flex items-center px-3 justify-between'>
              <div className='flex space-x-2 items-center'>
                <span className='text-[18px] font-[500] text-[#101828]'>Banners</span>
                <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{attributeData.length} Banners</span>
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
            </div>

            {/* Table content here */}
            <Paper >
              <TableContainer component={Paper} sx={{ height: '100%', width: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow className='!bg-[#F9FAFB]'>
                      {/* Define your table header columns */}
                      <TableCell style={{ minWidth: 50 }}>SL no</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Title</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Website Banner</TableCell>
                      <TableCell style={{ minWidth: 150 }}>Mobile Banner</TableCell>
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
                            {row.attribute_name}
                          </TableCell>
                          <TableCell>
                            {row.attribute_name}
                          </TableCell>
                          <TableCell>
                            {row.attribute_name}
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

        </div>
        :
        <div className=' py-[10px] flex flex-col space-y-5'>
          <div className='flex flex-col space-y-1'>
            <span className='text-[30px] text-[#101828] font-[500]'>Banners Setup</span>
            <span className='text-[#667085] font-[400] text-[16px]'>Elevate Visual Impact with Intuitive Banner Configuration in Admin Applications.</span>
          </div>

          <div className='grid grid-cols-3 gap-4 gap-[10px]'>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Title *</span>
              <input type='text' placeholder='Horn' className='inputText' name='sub_category_name' />
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Item Type *</span>
              <select name='category_id' >
                <option>Choose Category</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Select Category *</span>
              <select name='category_id' >
                <option>Choose Category</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Select Sub Category *</span>
              <select name='category_id' >
                <option>Choose Category</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Select Super Sub Category *</span>
              <select name='category_id' >
                <option>Choose Category</option>
              </select>
            </div>
            <div className='flex flex-col space-y-1 w-full'>
              <span>Select Product *</span>
              <select name='category_id' >
                <option>Choose Category</option>
              </select>
            </div>
          </div>

          <div className='flex items-center justify-between gap-[30px]'>
            <div className='flex flex-col space-y-2  w-[100%]'>
              <span className='text-[18px] font-[600]'>Website banner</span>
              <div className="flex flex-col items-center justify-center text-[16px]">
                <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                  <div className="text-[40px]">
                    <FaCloudUploadAlt />
                  </div>
                  <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                  <span className="mt-2 text-[10px] font-bold">OR</span>
                  <button
                    className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                    onClick={handleButtonClick}
                  >
                    Click to Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept='image/*'
                  />
                </div>
                <div className="flex flex-wrap items-center mt-3">
                  {uploadedImages.map((imageDataUrl, index) => (
                    <div key={index} className="p-2 relative">
                      <img src={imageDataUrl} alt={`Uploaded ${index + 1}`} className="max-w-[80px] max-h-[80px]" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        onClick={() => handleImageRemove(index)}
                      >
                        <FaTimes className='text-[10px]' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex flex-col space-y-2  w-[100%]'>
              <span className='text-[18px] font-[600]'>Mobile banner</span>
              <div className="flex flex-col items-center justify-center text-[16px]">
                <div className="flex flex-col space-y-1 items-center border border-dashed border-gray-400 p-[10px] rounded-lg text-center w-full">
                  <div className="text-[40px]">
                    <FaCloudUploadAlt />
                  </div>
                  <header className="text-[10px] font-semibold">Drag & Drop to Upload File</header>
                  <span className="mt-2 text-[10px] font-bold">OR</span>
                  <button
                    className=" text-[12px] text-[#A1853C] font-[600] rounded hover:text-[#A1853C]/60 transition duration-300"
                    onClick={handleButtonClick}
                  >
                    Click to Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept='image/*'
                  />
                </div>
                <div className="flex flex-wrap items-center mt-3">
                  {uploadedImages.map((imageDataUrl, index) => (
                    <div key={index} className="p-2 relative">
                      <img src={imageDataUrl} alt={`Uploaded ${index + 1}`} className="max-w-[80px] max-h-[80px]" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        onClick={() => handleImageRemove(index)}
                      >
                        <FaTimes className='text-[10px]' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-[24px] justify-end'>
            <span className='resetButton' onClick={resetButton}>Reset</span>
            <span className='submitButton'>Submit</span>
          </div>
        </div>
      }
    </div>
  )
}

export default Banners