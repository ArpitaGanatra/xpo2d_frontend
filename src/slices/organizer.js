import { createSlice } from '@reduxjs/toolkit';

import axios from 'src/utils/axios';

const initialState = {
    organizers: [],
    eventId: null    
};

const slice = createSlice({
    name: 'organizer',
    initialState,
    reducers: {        
        getorganizer(state, action) {           
            let organizer = []            
            organizer = action.payload
            state.organizers = organizer;             
            if(organizer.length > 0)              
            {
                state.eventId = organizer[0].event_id;
                localStorage.setItem('eventId', organizer[0].event_id); 
                localStorage.setItem('org_logo', organizer[0].company_logo);  
                localStorage.setItem('org_data', JSON.stringify(organizer));
               
            }
                        
        },                   
    }
});

export const reducer = slice.reducer;

export const getorganizer= (domain_name) => async (dispatch) => {    
    const response = await axios.get(`/api/organizer/domain?domain_name=${domain_name}`);    
    dispatch(slice.actions.getorganizer(response.data));
};
export default slice;
