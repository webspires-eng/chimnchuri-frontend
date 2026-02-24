

import React from 'react'
import Header from '../_components/Header'
import Footer from '../_components/Footer'

const MainLayout = ({ children }) => {
    return (
        <div className='flex flex-col  min-h-screen'>
            <div className="">
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default MainLayout
