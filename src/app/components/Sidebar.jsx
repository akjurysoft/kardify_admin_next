'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/images/logo.svg'
import dashboard from '../../../public/images/dashboard.svg'
import category from '../../../public/images/category.svg'
import product from '../../../public/images/product.svg'
import banner from '../../../public/images/banner.svg'
import { MdLogout } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from 'react-icons/fa6';
import RightSide from './RightSide';
import Dashboard from './Dashboard';
import Category from './Category';
import SubCategory from './SubCategory';
import SuperSubCategory from './SuperSubCategory';
import ProductAttribute from './ProductAttribute';
import ProductList from './ProductList';
import BulkImport from './BulkImport';
import CarList from './CarList';

const Sidebar = () => {

    const [activeComponent, setActiveComponent] = useState('dashboard'); // Initially set to 'dashboard'
    const handleMenuItemClick = (component) => {
        setActiveComponent(component);
    };



    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);

    const toggleCategoryDropdown = () => {
        console.log('first')
        setIsCategoryOpen(!isCategoryOpen);
    };

    const toggleProductDropdown = () => {
        setIsProductOpen(!isProductOpen);
    };
    return (
        <div className='flex h-screen'>

            {/*------------------------------- Lest side Menu -------------------------------------*/}
            <div className="flex flex-col w-1/4 p-4 bg-[#fcf8ee] justify-between h-full text-white">
                <div className='flex items-center space-x-3 py-2'>
                    <Image src={logo} width={50} height={50} />
                    <span className='text-black font-bold'>Kardify</span>
                </div>


                <ul className="space-y-3 text-black h-[100%] overflow-y-scroll">
                    <li className={`leftMenuHover p-[10px] rounded-[8px] cursor-pointer ${activeComponent === 'dashboard'? 'activeLeftMenu': ''}`} onClick={() => handleMenuItemClick('dashboard')}>
                        <div className='flex items-center gap-[10px] '>
                            <Image src={dashboard} height={20} width={20} />
                            Dashboard
                        </div>
                    </li>
                    <div className='flex flex-col spac-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>Product Management</span>
                        <li className='leftMenuHover p-[10px] rounded-[8px] cursor-pointer' onClick={toggleCategoryDropdown}>
                            <div className='flex items-center justify-between gap-[10px] ' >
                                <div className='flex item-center gap-[10px]'>
                                    <Image src={category} height={20} width={20} />
                                    Category Setup
                                </div>
                                {isCategoryOpen ? <FaAngleUp /> : <FaAngleDown />}
                            </div>
                        </li>
                        {isCategoryOpen && (
                            <div className='flex flex-col space-y-1 py-2'>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'category'? 'activeLeftMenu': ''}`} onClick={() => handleMenuItemClick('category')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Categories</span>
                                </div>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'subcategory'? 'activeLeftMenu': ''}`} onClick={() => handleMenuItemClick('subcategory')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Sub categories</span>
                                </div>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'supersubcategory'? 'activeLeftMenu': ''}`} onClick={() => handleMenuItemClick('supersubcategory')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Super Sub categories</span>
                                </div>
                            </div>
                        )}
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px] cursor-pointer' onClick={toggleProductDropdown}>
                            <div className='flex items-center justify-between gap-[10px]' >
                                <div className='flex item-center gap-[10px]'>
                                    <Image src={product} height={20} width={20} />
                                    Product Setup
                                </div>
                                {isProductOpen ? <FaAngleUp /> : <FaAngleDown />}
                            </div>
                        </li>
                        {isProductOpen && (
                            <div className='flex flex-col space-y-1 py-2'>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'productattribute'? 'activeLeftMenu': ''}`} onClick={() => handleMenuItemClick('productattribute')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Product Attribute</span>
                                </div>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'productlist'? 'activeLeftMenu': ''}`} onClick={() => handleMenuItemClick('productlist')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Product List</span>
                                </div>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'bulkimport'? 'activeLeftMenu': ''}`} onClick={() => handleMenuItemClick('bulkimport')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Bulk Import</span>
                                </div>
                                <div className={`flex items-center hover:bg-[#cfaa4c]/60 hover:text-[#fff] rounded-[8px] gap-[20px] cursor-pointer p-[10px] ${activeComponent === 'carlist'? 'activeLeftMenu': ''}`} onClick={() => handleMenuItemClick('carlist')}>
                                    <span className='bg-black w-[7px] h-[7px] rounded-full'></span>
                                    <span className='text-[15px] hover:text-[#FCF8EE]'>Car List</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-col spac-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>Promotion Management</span>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px]'>
                            <Link href="/category" className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Banners
                            </Link>
                        </li>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px]'>
                            <Link href="/home" className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Coupons
                            </Link>
                        </li>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px]'>
                            <Link href="/home" className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Dicounts
                            </Link>
                        </li>
                    </div>
                    <div className='flex flex-col spac-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>Order Management</span>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px] cursor-pointer'>
                            <div className='flex items-center justify-between gap-[10px]'>
                                <div className='flex item-center gap-[10px]'>
                                    <Image src={product} height={20} width={20} />
                                    Order Setup
                                </div>
                            </div>
                        </li>
                    </div>
                    <div className='flex flex-col spac-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>Installer Setting</span>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px]'>
                            <Link href="/category" className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Installer List
                            </Link>
                        </li>
                    </div>
                    <div className='flex flex-col spac-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>System Setting</span>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px]'>
                            <Link href="/category" className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Static pages
                            </Link>
                        </li>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px]'>
                            <Link href="/category" className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Dynamic pages
                            </Link>
                        </li>
                    </div>
                    <div className='flex flex-col spac-y-2'>
                        <span className='text-[12px] text-[#7D672E]'>User Management</span>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px]'>
                            <Link href="/category" className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Customer List
                            </Link>
                        </li>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px]'>
                            <Link href="/category" className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Subscribed Customers
                            </Link>
                        </li>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px]'>
                            <Link href="/category" className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Customers Stories
                            </Link>
                        </li>
                        <li className='hover:bg-[#cfaa4c]/60 hover:text-[#fff] p-[10px] rounded-[8px]'>
                            <Link href="/category" className='flex items-center gap-[10px]'>
                                <Image src={banner} height={20} width={20} />
                                Product Review
                            </Link>
                        </li>
                    </div>
                </ul>


                <div className=' border-t border-slate-300'>
                    <div className='flex space-x-3 justify-between items-center py-2'>
                        <div className='rounded-full'>
                            <Image src={logo} height={50} width={50} />
                        </div>
                        <div className='flex flex-col space-y-1'>
                            <span className='text-black '>Kardify</span>
                            <span className='text-slate-400'>admin@gmail.com</span>
                        </div>
                        <MdLogout className='text-black text-[25px]' />
                    </div>
                </div>
            </div>



            {/* -------------------------- Right side screens ------------------------------- */}
            {activeComponent === 'dashboard' && <Dashboard />}

            {activeComponent === 'category' && <Category />}

            {activeComponent === 'subcategory' && <SubCategory />}

            {activeComponent === 'supersubcategory' && <SuperSubCategory />}

            {activeComponent === 'productattribute' && <ProductAttribute />}

            {activeComponent === 'productlist' && <ProductList />}

            {activeComponent === 'bulkimport' && <BulkImport />}

            {activeComponent === 'carlist' && <CarList />}

        </div>
    )
}

export default Sidebar