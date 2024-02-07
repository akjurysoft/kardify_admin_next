import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaRegTrashAlt, FaTimes } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Switch from '@mui/material/Switch';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Pagination, TextField, Chip } from '@mui/material';
import Image from 'next/image';
import Swal from 'sweetalert2'
import { MdAdd } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useSnackbar } from '../snackbarProvider';
import axios from '../../../axios';
import { Autocomplete, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getProductAttributes } from '../api';



const ProductList = () => {
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
      axios.get("/api/fetch-categories")
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
      axios.get("/api/fetch-subcategories")
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
      axios.get("/api/fetch-supersubcategories")
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


  // ----------------------------------------------Fetch Car Brands section Starts-----------------------------------------------------
  const [carBrandsData, setCarBrandsData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCarBrandsData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchCarBrandsData = useCallback(
    () => {
      axios.get("/api/fetch-car-brands")
        .then((res) => {
          if (res.data.status === 'success') {
            setCarBrandsData(res.data.brandName)
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Car Brands section Ends-----------------------------------------------------

  // ----------------------------------------------Fetch Car Model section Starts-----------------------------------------------------
  const [carModelsData, setCarModelsData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchCarModelsData()
    }

    return () => { unmounted = true };
  }, [])

  const fetchCarModelsData = useCallback(
    () => {
      axios.get("/api/fetch-car-models")
        .then((res) => {
          if (res.data.status === 'success') {
            setCarModelsData(res.data.modelName)
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Car Model section Ends-----------------------------------------------------

  // ----------------------------------------------Fetch Products section Starts-----------------------------------------------------
  const [productData, setProductData] = useState([])

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchProductData()
      fetchProductAttribute()
    }

    return () => { unmounted = true };
  }, [])

  const fetchProductData = useCallback(
    () => {
      axios.get("/api/get-products")
        .then((res) => {
          if (res.data.status === 'success') {
            setProductData(res.data.products)
          }
        })
        .then(err => {
          console.log(err)
        })
    },
    [],
  )

  // ----------------------------------------------Fetch Products section Ends-----------------------------------------------------


  // ----------------------------------------------Add Products section Starts-----------------------------------------------------
  const [getProductData, setGetProductData] = useState({
    product_name: '',
    product_desc: '',
    product_brand: '',
    category_id: '',
    sub_category_id: '',
    super_sub_category_id: '',
    minimum_order: '',
    default_price: '',
    stock: '',
    discount_type: '',
    discount: '',
    tax_type: '',
    tax_rate: '',
    product_type: '',
    car_brand_id: '',
    car_model_id: '',
    has_exchange_policy: '',
    exchange_policy: '',
    has_cancellaton_policy: '',
    cancellation_policy: '',
    quantity: '',
    has_warranty: '',
    warranty: ''
  })

  console.log(getProductData)

  // product brand info section
  const [showSecondDiv, setShowSecondDiv] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedCarBrand, setSelectedCarBrand] = useState('');
  const [selectedCarModel, setSelectedCarModel] = useState('');

  const [selectedBrandObject, setSelectedBrandObject] = useState({})
  const [selectedModelObject, setSelectedModelObject] = useState({})
  const handleProductTypeChange = (event) => {
    const selectedValue = event.target.value;
    setShowSecondDiv(selectedValue === 'vehicle selection');
    setSelectedProductType(selectedValue);
  };
  const handleCarBrandChange = (event) => {
    const selectedBrand = event.target.value;
    setSelectedCarBrand(selectedBrand);
  };
  useEffect(() => {
    setSelectedBrandObject(carBrandsData.find((brand) => brand.id == selectedCarBrand));
  }, [carBrandsData, selectedCarBrand])

  const handleCarModelChange = (event) => {
    const selectedModel = event.target.value;
    setSelectedCarModel(selectedModel);
  };
  useEffect(() => {
    setSelectedModelObject(carModelsData.find((brand) => brand.id == selectedCarModel))
  }, [carModelsData, selectedCarModel])


  const getData = (e) => {
    const { value, name } = e.target;

    setGetProductData(() => {
      return {
        ...getProductData,
        [name]: value
      }
    })
  }


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

  const handleAddProduct = () => {

    if (selectedProductType === 'Select Product Type') {
      openSnackbar('Choose Product Type', 'error');
    }
    else if (selectedProductType === 'vehicle selection' && (!selectedCarBrand || !selectedCarModel)) {
      openSnackbar('please select both car brand and car model.', 'error');
    } else {
      const formData = new FormData();
      formData.append('product_name', getProductData.product_name),
        formData.append('product_desc', getProductData.product_desc),
        formData.append('product_brand', getProductData.product_brand),
        formData.append('category_id', getProductData.category_id),
        formData.append('sub_category_id', getProductData.sub_category_id),
        formData.append('super_sub_category_id', getProductData.super_sub_category_id),
        formData.append('minimum_order', getProductData.minimum_order),
        formData.append('default_price', getProductData.default_price),
        formData.append('stock', getProductData.stock),
        formData.append('product_type', selectedProductType),
        formData.append('car_brand_id', selectedBrandObject.id),
        formData.append('car_model_id', selectedModelObject.id),
        formData.append('discount_type', getProductData.discount_type),
        formData.append('discount', getProductData.discount),
        formData.append('tax_type', getProductData.tax_type),
        formData.append('tax_rate', getProductData.tax_rate),
        formData.append('quantity', getProductData.quantity),
        formData.append('image_count', uploadedImages.length);

      images.forEach((image, index) => {
        formData.append(`image_${index + 1}`, image);
      });
      axios({
        method: "POST",
        url: '/api/add-products',
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then(res => {
          if (res.data.status === 'success') {
            openSnackbar(res.data.message, 'success');
            setIsClickedAddProduct(false)
            fetchProductData()
            setSelectedBrandObject({})
            setSelectedModelObject({})
            setUploadedImages([])
          } else {
            openSnackbar(res.data.message, 'error');
          }
        })
        .catch(err => {
          console.log(err)
          openSnackbar(err.response.data.message, 'error');
        })

    }

  }

  // ----------------------------------------------Add Products section Ends-----------------------------------------------------



  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalRows = productData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = productData.filter((e) =>
    e.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const deleteCategory = (data) => {
    Swal.fire({
      title: "Delete",
      text: `Do you want to Delete this ${data.col1}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Delete it"
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedRows = categoryData.filter((row) => row.id !== data.id);
        setCategoryData(updatedRows);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  };

  const [isClickedAddProduct, setIsClickedAddProduct] = useState(false)
  const handleAddNewProduct = () => {
    setIsClickedAddProduct(true)
  }

  const handleBack = () => {
    setIsClickedAddProduct(false)
    setShowSecondDiv(false)
    setSelectedCarBrand('')
    setSelectedCarModel('')
    setSelectedBrandObject({})
    setSelectedModelObject({})
    setUploadedImages([])
  }


  // ----------------------product attribute combination section ------------------------------------
  const [getAllProductAttribute, setGetAllProductAttribute] = useState([])
  const fetchProductAttribute = async () => {
    try {
      const productAttributeData = await getProductAttributes();
      setGetAllProductAttribute(productAttributeData.attributes);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = getAllProductAttribute.filter(product => product.status === 1);
  const [selectedProductAttribute, setSelectedProductAttribute] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState([])
  const [data, setData] = useState({});

  console.log('selectedProductAttribute',selectedProductAttribute)
  console.log('selectedAttribute',selectedAttribute)

  const handleProductChange = (event, value) => {
    setSelectedProductAttribute(value);
    setSelectedAttribute((prevData) => ({
      ...prevData,
      attributes: value.map((product) => ({ attribute_name: product.attribute_name, attribute_options: [] })),
    }));
  };


  const handleAttributeOptionChange = (attributeIndex, options) => {
    setSelectedAttribute((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes[attributeIndex].attribute_options = options;
      return { ...prevData, attributes: updatedAttributes };
    });
  };

  // const handleInputChange = (event, attributeIndex) => {
  //   const { value } = event.target;
  //   console.log(value)
  //   if (value.endsWith(' ') || value.endsWith(',')) {
  //     const option = value.trim();
  //     if (option.length > 0) {
  //       setSelectedAttribute((prevData) => {
  //         const updatedAttributes = [...prevData.attributes];
  //         updatedAttributes[attributeIndex].attribute_options = [
  //           ...updatedAttributes[attributeIndex].attribute_options,
  //           option
  //         ];
  //         return { ...prevData, attributes: updatedAttributes };
  //       });
  //       event.target.value = '';
  //     }
  //   }
  // };

  const handleInputChange = (event, attributeIndex) => {
    const { value } = event.target;
    setSelectedAttribute((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes[attributeIndex].attribute_options = value.split(',').map(option => option.trim());
      return { ...prevData, attributes: updatedAttributes };
    });
  };



  const handleDeleteOption = (attributeIndex, option) => {
    setSelectedAttribute((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes[attributeIndex].attribute_options = updatedAttributes[attributeIndex].attribute_options.filter(item => item !== option);
      return { ...prevData, attributes: updatedAttributes };
    });
  };


  // const generateCombinations = (attributes) => {
  //   const combinations = [];

  //   attributes && attributes.forEach((attribute, index) => {
  //     attribute.attribute_options.forEach((option) => {
  //       for (let i = index + 1; i < attributes.length; i++) {
  //         attributes[i].attribute_options.forEach((otherOption) => {
  //           combinations.push(`${option}-${otherOption}`);
  //         });
  //       }
  //     });
  //   });

  //   return combinations;
  // };

  const generateCombinations = (attributes) => {
    const combinations = [];

    const attributeOptions = attributes ? attributes.map(attr => attr.attribute_options) : [];

    const generate = (index, combination) => {
      if (index === attributes?.length) {
        combinations.push(combination.join('-'));
        return;
      }
      if (Array.isArray(attributeOptions[index]) && attributeOptions[index].length > 0) {
        for (const option of attributeOptions[index]) {
          generate(index + 1, [...combination, option]);
        }
      }
    };

    generate(0, []);

    return combinations;
  };

  // const generateFieldData = (combinations) => {
  //   return combinations.map((combination) => {
  //     const parts = combination.split('-');
  //     const fields = [
  //       { label: 'price', name: `${combination}_price`, type: 'text' },
  //       { label: 'stock', name: `${combination}_stock`, type: 'text' }
  //     ];

  //     const onChange = (fieldName, value) => {
  //       setData((prevData) => ({
  //         ...prevData,
  //         [fieldName]: value
  //       }));
  //       console.log('Data:', data);
  //     };

  //     fields.forEach(field => {
  //       field.onChange = onChange(field.name); 
  //     });

  //     return { combination, fields };
  //   });
  // };

  const generateFieldData = (combinations) => {
    return combinations.map((combination) => {
      console.log('combination', combination)
      const fields = [
        { label: 'price', name: `${combination}_price`, type: 'text' },
        { label: 'stock', name: `${combination}_stock`, type: 'text' }
      ];

      return { combination, fields };
    });
  };

  const onChange = (fieldName, value) => {
    setData(prevData => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  console.log('data', data)

  const combinations = generateCombinations(selectedAttribute.attributes);
  console.log('combinations', combinations);

  const fieldData = generateFieldData(combinations);
  console.log('fieldData', fieldData)

  return (
    <>
      <div className='px-[20px] py-[10px] space-y-5 container mx-auto w-[100%] overflow-y-scroll'>
        {!isClickedAddProduct ?
          <>

            <div className=' py-[10px] flex flex-col space-y-5'>
              <div className='flex flex-col space-y-1'>
                <span className='text-[30px] text-[#101828] font-[500]'>Product List</span>
                <span className='text-[#667085] font-[400] text-[16px]'>Simplify product management and presentation with Product Setup, ensuring a streamlined and visually compelling e-commerce storefront.</span>
              </div>
            </div>
            <div className='flex items-center justify-between gap-[10px]'>
              <div className='flex flex-col space-y-1 w-full'>
                <span className='text-[14px] font-[500] text-[#344054]'>Search by category</span>
                <input type='text' placeholder='Exterior' className='inputText' />
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span className='text-[14px] font-[500] text-[#344054]'>Search by sub category</span>
                <input type='text' placeholder='Exterior' className='inputText' />
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span className='text-[14px] font-[500] text-[#344054]'>Search by super sub category</span>
                <input type='text' placeholder='Exterior' className='inputText' />
              </div>
              <div className='flex flex-col space-y-1 w-full'>
                <span className='text-[14px] font-[500] text-[#344054]'>Search by Brand</span>
                <input type='text' placeholder='Exterior' className='inputText' />
              </div>
            </div>

            <div className='flex flex-col space-y-5  border border-[#EAECF0] rounded-[8px] p-[10px]'>
              <div className='flex items-center px-3 justify-between'>
                <div className='flex space-x-2 items-center'>
                  <span className='text-[18px] font-[500] text-[#101828]'>Product List</span>
                  <span className='px-[10px] py-[5px] bg-[#FCF8EE] rounded-[16px] text-[12px] text-[#A1853C]'>{productData.length} Products</span>
                </div>
                <div className='flex items-center space-x-3 inputText w-[50%]'>
                  <IoSearch className='text-[20px]' />
                  <input
                    type='text'
                    className='outline-none focus-none'
                    placeholder='Search By Product'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className='flex space-x-2'>
                  <div className='px-[16px] py-[10px] gap-[5px] flex items-center rounded-[8px] border border-[#D0D5DD] cursor-pointer '>
                    <MdOutlineFileDownload className='text-[20px] font-[600]' />
                    <span className=' text-[14px] font-[600]'>Export</span>
                  </div>
                  <div className='flex items-center gap-[5px] px-[18px] py-[10px] bg-[#cfaa4c] rounded-[8px] cursor-pointer hover:opacity-70' onClick={handleAddNewProduct}>
                    <MdAdd className='text-[#fff] text-[20px] font-[600]' />
                    <span className=' text-[14px] text-[#fff] font-[600]'>Add New Product</span>
                  </div>
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
                        <TableCell style={{ minWidth: 200 }}>Car Brand</TableCell>
                        <TableCell style={{ minWidth: 150 }}>Product Image</TableCell>
                        <TableCell style={{ minWidth: 300 }}>Product Name</TableCell>
                        <TableCell style={{ minWidth: 300 }}>Category Name</TableCell>
                        <TableCell style={{ minWidth: 150 }}>Stock</TableCell>
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
                            <TableCell>{row.car_brand.brand_name}</TableCell>
                            <TableCell>
                              <Image src="/images/categoryimage.svg" width={40} height={30} alt='categroy' className='rounded-[8px]' />
                            </TableCell>
                            <TableCell>{row.product_name}</TableCell>
                            <TableCell>{row.category.category_name}</TableCell>
                            <TableCell>{row.stock}</TableCell>
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
          </>
          :
          <>
            <div className=' py-[10px] flex flex-col space-y-5'>
              <div className='flex flex-col space-y-1'>
                <span className='text-[30px] text-[#101828] font-[500]'>Add New Product</span>
                <span className='text-[#667085] font-[400] text-[16px]'>Introduce new items effortlessly with the Add New Product feature in the admin application for a dynamic and up-to-date online store.</span>
              </div>
            </div>

            <div className='flex items-center justify-between gap-[30px]'>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Add New Product</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Product Name</span>
                  <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Add new product name' name='product_name' onChange={getData} />
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Description</span>
                  <textarea className='outline-none focus-none inputText !text-[14px] h-[120px]' placeholder='Add product description' name='product_desc' onChange={getData} />
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Brand Name</span>
                  <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Add product brand name' name='product_brand' onChange={getData} />
                </div>
              </div>
              <div className='flex flex-col border space-y-3 border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Category</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Select Main Category</span>
                  <select className='!text-[14px]' name='category_id' onChange={getData}>
                    <option>Choose Category</option>
                    {categoryData && categoryData.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.category_name}</option>
                    )}
                  </select>
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Select Sub Category</span>
                  <select className='!text-[14px]' name='sub_category_id' onChange={getData}>
                    <option>Choose Sub Category</option>
                    {subCategoryData && subCategoryData.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.sub_category_name}</option>
                    )}
                  </select>
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Select Super Sub Category</span>
                  <select className='!text-[14px]' name='super_sub_category_id' onChange={getData}>
                    <option>Choose Super Sub Category</option>
                    {superSubCategoryData && superSubCategoryData.filter(e => e.status).map((e, i) =>
                      <option key={i} value={e.id}>{e.super_sub_category_name}</option>
                    )}
                  </select>
                </div>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Maximum Order Quantity</span>
                  <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Ex: 05' name='minimum_order' onChange={getData} />
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between gap-[30px]'>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Product Image</span>
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
                      multiple
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
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Price Info</span>
                <div className='flex items-center justify-between gap-[10px]'>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Default Unit Price</span>
                    <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Price of product (in rupees)' name='default_price' onChange={getData} />
                  </div>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Product Stock</span>
                    <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='stock' name='stock' onChange={getData} />
                  </div>
                </div>
                <div className='flex items-center justify-between gap-[10px]'>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Discount Type</span>
                    {/* <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Add new product name' /> */}
                    <select className='!text-[14px] outline-none focus-none' name='discount_type' onChange={getData}>
                      <option value='0'>Select Discount Type</option>
                      <option value='percent'>Percent</option>
                      <option value='amount'>Amount</option>
                    </select>
                  </div>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Discount</span>
                    <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='0' name='discount' onChange={getData} />
                  </div>
                </div>
                <div className='flex items-center justify-between gap-[10px]'>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Tax Type</span>
                    {/* <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='Add new product name' /> */}
                    <select className='!text-[14px] outline-none focus-none' name='tax_type' onChange={getData}>
                      <option value='0'>Select Tax Type</option>
                      <option value='percent'>Percent</option>
                      <option value='amount'>Amount</option>
                    </select>
                  </div>
                  <div className='flex flex-col space-y-1 w-full'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Tax rate</span>
                    <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='0' onChange={getData} name='tax_rate' />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-end justify-between gap-[30px]'>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Product Brand Info</span>
                <div className='flex flex-col space-y-1 w-full'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Product Type</span>
                  <select className='!text-[14px] outline-none focus-none' onChange={handleProductTypeChange}>
                    <option>Select Product Type</option>
                    <option value='vehicle selection'>Vehicle Selection</option>
                    <option value='general'>General</option>
                  </select>
                  <div className={`flex flex-col space-y-1 w-full ${showSecondDiv ? '' : 'hidden'}`}>
                    <div className='flex items-end gap-[10px]'>
                      <div className='flex flex-col space-y-1 w-full'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Car Brand</span>
                        <select className='!text-[14px] outline-none focus-none w-[100%]' onChange={handleCarBrandChange}>
                          <option>Select Brand Here</option>
                          {carBrandsData && carBrandsData.map((e, i) =>
                            <option key={i} value={e.id}>{e.brand_name}</option>
                          )}
                        </select>
                      </div>
                      {
                        selectedBrandObject?.image_url &&
                        <img src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${selectedBrandObject?.image_url}`} alt={selectedBrandObject?.brand_name || ''} width={70} height={50} className='rounded-[8px]' />
                      }
                    </div>
                    <div className='flex items-end gap-[10px]'>
                      <div className='flex flex-col space-y-1 w-full'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Car Model</span>
                        <select className='!text-[14px] outline-none focus-none w-[100%]' onChange={handleCarModelChange}>
                          <option>Select Car Model Here</option>
                          {carModelsData && carModelsData.filter(e => e.status).map((e, i) =>
                            <option key={i} value={e.id}>{e.model_name}</option>
                          )}
                        </select>
                      </div>
                      {
                        selectedModelObject?.image_url &&
                        <img src={selectedModelObject?.image_url ? `${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${selectedModelObject?.image_url}` : ''} alt={selectedModelObject?.model_name || ''} width={70} height={50} className='rounded-[8px]' />
                      }
                    </div>
                    {/* <div className='flex items-end gap-[10px]'>
                      <div className='flex flex-col space-y-1 w-full'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Start Year</span>
                        <select className='!text-[14px] outline-none focus-none w-[100%]'>
                          <option>Select Brand Here</option>
                          <option>Audi</option>
                          <option>BMW</option>
                        </select>
                      </div>
                      <div className='flex flex-col space-y-1 w-full'>
                        <span className='text-[14px] text-[#344054] font-[500]'>Last Year</span>
                        <select className='!text-[14px] outline-none focus-none w-[100%]'>
                          <option>Select Brand Here</option>
                          <option>Audi</option>
                          <option>BMW</option>
                        </select>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Exchange Policy</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Description</span>
                  <textarea className='outline-none focus-none inputText !text-[14px] h-[190px]' placeholder='Add description' />
                </div>
                <div className='flex items-center gap-[20px] justify-between'>
                  <span className='px-[18px] py-[10px] rounded-[8px] border border-[#D0D5DD] w-full text-center text-[16px] font-[600] bg-[#fff] cursor-pointer'>No</span>
                  <span className='px-[18px] py-[10px] rounded-[8px] text-[#fff] w-full text-center text-[16px] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer'>Yes, there is</span>
                </div>
              </div>
            </div>

            <div className='flex items-end justify-between gap-[30px]'>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Net Quantity and warranty info</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Net Quantity</span>
                  <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='06' name='quantity' onChange={getData} />
                </div>
                <div className='flex items-end gap-[10px]'>
                  <div className='flex flex-col space-y-1'>
                    <span className='text-[14px] text-[#344054] font-[500]'>Warranty</span>
                    <input type='text' className='outline-none focus-none inputText !text-[14px]' placeholder='06' />
                  </div>
                  <div className='flex items-center gap-[20px] justify-between w-full'>
                    <span className='px-[10px] py-[10px] rounded-[8px] border border-[#D0D5DD] w-full text-center text-[16px] font-[600] bg-[#fff] cursor-pointer'>No</span>
                    <span className='px-[10px] py-[10px] rounded-[8px] text-[#fff] w-full text-center text-[16px] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer'>Yes, there is</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
                <span className='text-[18px] font-[600]'>Cancellation Policy</span>
                <div className='flex flex-col space-y-1'>
                  <span className='text-[14px] text-[#344054] font-[500]'>Description</span>
                  <textarea className='outline-none focus-none inputText !text-[14px] h-[190px]' placeholder='Add description' />
                </div>
                <div className='flex items-center gap-[20px] justify-between'>
                  <span className='px-[18px] py-[10px] rounded-[8px] border border-[#D0D5DD] w-full text-center text-[16px] font-[600] bg-[#fff] cursor-pointer'>No</span>
                  <span className='px-[18px] py-[10px] rounded-[8px] text-[#fff] w-full text-center text-[16px] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer'>Yes, there is</span>
                </div>
              </div>
            </div>

            <div className='flex flex-col space-y-3 border border-[#D0D5DD] rounded-[16px] p-[16px] w-[100%]'>
              <span className='text-[18px] font-[600]'>Attribute</span>
              <div className='flex flex-col space-y-3 w-full'>
                <span className='text-[14px] text-[#344054] font-[500]'>Attribute</span>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple

                    options={filteredProducts}
                    getOptionLabel={(option) => option.attribute_name}
                    value={selectedProductAttribute}
                    onChange={handleProductChange}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox color="primary" checked={selected} />
                        {option.attribute_name}
                      </li>
                    )}
                    style={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Attributes"
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>

                {/* {selectedProductAttribute.map((attribute, index) => (
                  <div key={index} className='flex items-center  space-y-2 mt-2'>
                    <label htmlFor={`attribute-${attribute.attribute_name}`} className='text-[14px] text-[#344054] font-[500] w-[20%]'>
                      {attribute.attribute_name}
                    </label>
                    <input
                      type='text'
                      id={`attribute-${attribute.attribute_name}`}
                      name={`attribute-${attribute.attribute_name}`}
                      className='outline-none focus-none inputText !text-[14px] w-[80%]'
                      placeholder={`Enter ${attribute.attribute_name}`}
                    />
                  </div>
                ))} */}

                {/* {selectedAttribute.attributes && Array.isArray(selectedAttribute.attributes) && selectedAttribute.attributes.map((attribute, attributeIndex) => (
                  <div key={attributeIndex} className='flex flex-col items-start space-y-2 mt-2'>
                    <span className='text-[14px] text-[#344054] font-[500]'>
                      {attribute.attribute_name}
                    </span>
                    <FormControl fullWidth>
                      <Autocomplete
                        multiple
                        options={attributeOptions[attribute.attribute_name] || []} // Provide options based on attribute name
                        value={attribute.selectedOptions}
                        onChange={(event, value) => handleAttributeOptionChange(attributeIndex, value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder={`Select ${attribute.attribute_name}`}
                          />
                        )}
                      />
                    </FormControl>
                  </div>
                ))} */}

                {selectedAttribute.attributes && Array.isArray(selectedAttribute.attributes) && selectedAttribute.attributes.map((attribute, attributeIndex) => (
                  <>
                    <div key={attributeIndex} className='flex items-end space-y-2 mt-2'>
                      <span className='text-[14px] text-[#344054] font-[500] w-[20%]'>
                        {attribute.attribute_name}
                      </span>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {attribute.attribute_options.map((option, optionIndex) => (
                            <Chip
                              key={`${attributeIndex}-${option}`}
                              label={option}
                              onDelete={() => handleDeleteOption(attributeIndex, option)}
                              variant="outlined"
                              sx={{
                                backgroundColor: '#cfaa4d',
                                color: 'white',
                                borderColor: '#cfaa4d',
                                '&:hover': {
                                  backgroundColor: '#b9912d',
                                  color: 'white',
                                },
                                '& .MuiChip-deleteIcon': {
                                  color: 'white',
                                  '&:hover': {
                                    color: '#ffffffbf',
                                  },
                                },
                              }}
                            />
                          ))}
                        </div>
                        <FormControl fullWidth>
                          <span className='text-[10px] font-[500]'>Note: Enter <span className='text-red-700'>coma ( , )</span> to create new {attribute.attribute_name}</span>
                          <input
                            placeholder={`Enter ${attribute.attribute_name}`}
                            className='w-[100%] inputText focus-none outline-none !text-[14px] !text-[#354154]'
                            value={attribute.attribute_options.join(', ')}
                            // onChange={(event) => handleAttributeOptionChange(attributeIndex, event.target.value.split(',').map(option => option.trim()))}
                            onChange={(event) => handleInputChange(event, attributeIndex)}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </>
                ))}
                {fieldData && fieldData.map((data) => (
                  <div key={data.combination} className='flex items-end text-[#354154] font-[500] text-[14px] space-x-3'>
                    {data.combination !== '' ?
                      <>
                        <h3 className='w-[30%] font-[600]'>{data.combination}</h3>
                        {data.fields.map((field, index) => (
                          <div key={index} className='flex flex-col w-[60%]'>
                            <label>{field.label}</label>
                            <input
                              className='inputText outline-none focus-none !text-[14px]'
                              placeholder={field.label === 'price' ? 'Enter Price' : field.label === 'stock' ? 'Enter Stock' : 'Enter Value'}
                              type={field.type}
                              name={field.name}
                              value={data[field.name]}
                              onChange={(e) => onChange(field.name, e.target.value)}
                            />
                          </div>
                        ))}
                      </>
                      : <span className='text-center text-[12px] font-[500] w-full' >Choose Attributes For The Combination</span>}
                  </div>
                ))}
              </div>
            </div>


            <div className='flex items-center gap-[30px] justify-end'>
              <span className='px-[38px] py-[10px] rounded-[8px] border border-[#D0D5DD] text-[16px] text-[#344054] font-[600] cursor-pointer' onClick={handleBack}>Reset</span>
              <span className='px-[38px] py-[10px] rounded-[8px] text-[16px] text-[#fff] font-[600] bg-[#CFAA4C] hover:opacity-80 cursor-pointer' onClick={handleAddProduct}>Submit</span>
            </div>

          </>
        }
      </div>
    </>
  )
}

export default ProductList