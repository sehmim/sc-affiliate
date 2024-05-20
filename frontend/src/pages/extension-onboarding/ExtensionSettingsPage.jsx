import React from 'react'


const Navbar = () => (
    <header className='top-0 z-10 bg-white w-full h-20 px-5 py-3 flex justify-between items-center shadow'>
        <div className='d-flex justify-content-between w-100'>
            <a href='/'><img className='w-60' src={"https://i.imgur.com/UItnKy8.png"} alt="logo" /></a>
            <div>
                <span className='mr-4'>Settings</span>
                <button onClick={() => {}} type="button" className="btn btn-dark fw-bold">
                    Logout
                </button>
            </div>
        </div>
    </header>
)

export default function ExtensionSettings(props) {

    return (
        <>
            <Navbar />
            <div style={{ width: '900px', margin: 'auto' }} className='h-full mt-20 p-10'>
                <div className='d-flex align-items-center justify-content-between'>
                    <div>
                        <div className='fs-1 fw-bold pt-5'>Your Settings</div>
                        <div className="text-dark font-inter font-weight-light fs-6 text-muted pt-4">
                            Add your profiles’s information and  select a charity of your choice.  
                        </div>
                    </div>
                    <div>
                        <img style={{ width: '200px' }} src='https://i.imgur.com/BO1v7ec.png' alt='heart'/>
                    </div>
                </div>

                <div className='d-flex flex-column'>
                    <div className='d-flex mb-3'>
                        <div className='w-full'>
                            <label className='pb-2'>First name:</label> <br></br>
                            <input 
                                className='form-control w-full'
                                // onChange={(e) => setEmail(e.target.value)}
                                // value={email} 
                                type='text' 
                                placeholder='user@example.com'
                                id="lord-king-shadid"
                            />
                        </div>
                        <div className='w-full'>
                            <label className='pb-2'>Last name:</label> <br></br>
                            <input 
                                className='form-control w-full'
                                // onChange={(e) => setEmail(e.target.value)}
                                // value={email} 
                                type='text' 
                                placeholder='user@example.com'
                                id="lord-king-shadid"
                            />
                        </div>
                    </div>
                    <div className='mb-10'>
                        <label className='pb-2'>Email:</label> <br></br>
                        <input 
                            className='form-control w-full'
                            // onChange={(e) => setEmail(e.target.value)}
                            // value={email} 
                            type='text' 
                            placeholder='user@example.com'
                            id="lord-king-shadid"
                        />
                    </div>

                    <div className='mb-10'>
                        <label className='pb-2'>Select Charity:</label> <br></br>
                        <input 
                            className='form-control w-full'
                            // onChange={(e) => setEmail(e.target.value)}
                            // value={email} 
                            type='text' 
                            placeholder='user@example.com'
                            id="lord-king-shadid"
                        />
                    </div>
                </div>


                <div>
                    <div>Don’t have a charity in mind? Explore some charities below.</div>
                    <div className='d-flex justify-content-space-between mt-3'>
                        <div style={{ border: '1px solid', width: '265px', height: '129px' }}></div>
                        <div style={{ border: '1px solid', width: '265px', height: '129px' }}></div>
                        <div style={{ border: '1px solid', width: '265px', height: '129px' }}></div>
                    </div>
                </div>


                <div style={{ textAlign: 'center' }}>
                    <button style={{ width: '100px' }} onClick={() => {}} type="button" className="btn btn-dark fw-bold mt-3">
                        Save
                    </button>
                </div>
            </div>
        </>
    )
}
