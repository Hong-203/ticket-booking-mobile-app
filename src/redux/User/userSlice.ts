import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, UserProfile, AuthUser } from '../../types/user'

interface UserState {
  usersList: User[]
  userSearch: User[]
  userDetails: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  response: string | null
}

const initialState: UserState = {
  usersList: [],
  userSearch: [],
  userDetails: null,
  profile: null,
  loading: false,
  error: null,
  response: null
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getRequest(state) {
      state.loading = true
    },
    doneSuccess(state, action: PayloadAction<AuthUser>) {
      state.userDetails = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSuccess(state, action: PayloadAction<User[]>) {
      state.usersList = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getSearch(state, action: PayloadAction<User[]>) {
      state.userSearch = action.payload
      state.loading = false
      state.error = null
      state.response = null
    },
    getFailed(state, action: PayloadAction<string>) {
      state.response = action.payload
      state.loading = false
      state.error = null
    },
    getError(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    postDone(state) {
      state.loading = false
      state.error = null
      state.response = null
    },
    deleteSuccess(state, action: PayloadAction<string>) {
      state.usersList = state.usersList.filter(
        (item) => item.user_id !== action.payload
      )
      state.loading = false
      state.error = null
      state.response = 'Deleted successfully'
    },
    createSuccess(state, action: PayloadAction<User>) {
      state.usersList.push(action.payload)
      state.loading = false
      state.error = null
      state.response = 'Created successfully'
    },
    updateSuccess(state, action: PayloadAction<User>) {
      const index = state.usersList.findIndex(
        (item) => item.user_id === action.payload.user_id
      )
      if (index !== -1) {
        state.usersList[index] = action.payload
      }
      state.loading = false
      state.error = null
      state.response = 'Updated successfully'
    }
  }
})

export const {
  getRequest,
  doneSuccess,
  getSuccess,
  getFailed,
  getError,
  postDone,
  deleteSuccess,
  createSuccess,
  updateSuccess,
  getSearch,
  getProfile
} = userSlice.actions

export const userReducer = userSlice.reducer
