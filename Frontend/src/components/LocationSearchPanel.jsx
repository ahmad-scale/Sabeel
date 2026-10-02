import React from 'react'

const LocationSearchPanel = (props) => {

    const locations = [
        '23p1, H-909a, Mustafa Masjid Road, Kailash Nagar',
        '12A, Green Park Avenue, Gulshan-e-Iqbal',
        '45-B, Sunrise Street, Model Town',
        '78, Liberty Market Road, Garden Town',
        '9C, River View Lane, Clifton',
        '101, Crescent Boulevard, Bahria Town',
        '33, Maple Street, North Nazimabad',
        '16D, Palm Residency Road, Johar Town',
        '84, Central Avenue, DHA Phase 5',
        '27, Silver Heights Road, Gulberg'
    ]


    return (
        <div>
            {
                locations.map(function (elem, idx) {
                    return <div key={idx} onClick={() => {
                        props.setVehiclePanel(true)
                        props.setPanelOpen(false)
                    }} className='flex gap-3 border bg-gray-100 border-white active:border-emerald-950 rounded-3xl p-2 items-center my-5 justify-start'>
                        <h2 className=' h-15 flex items-center justify-center w-17 text-3xl text-emerald-900 rounded-full '><i className="ri-map-pin-fill"></i></h2>
                        <h4 className='text-lg font-medium leading-tight' >{elem}</h4>
                    </div>

                })
            }
        </div>
    )
}

export default LocationSearchPanel