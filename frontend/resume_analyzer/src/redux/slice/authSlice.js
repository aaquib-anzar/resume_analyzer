import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name:'auth',
    initialState:{
        isAuthenticated:false,
        user:null,
        loading:true
    },
    reducers:{
        setUser:(state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
        },
        clearUser:(state) => {
            state.user = null
            state.isAuthenticated = false
        },
        setLoading:(state, action) => {
            state.loading = action.payload
        }
    }
})
    
export const {setUser, clearUser, setLoading} = authSlice.actions
export default authSlice.reducer