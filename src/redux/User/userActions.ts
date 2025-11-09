import { AppDispatch } from '../store'
import axios from '../customAxios'
import { getAuthConfig } from '../authConfig'
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess,
  getProfile,
  updateSuccess,
  deleteSuccess
} from './userSlice'
import { AuthUser, User } from '../../types/user'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const register = (data: any) => async (dispatch: AppDispatch) => {
  dispatch(getRequest())

  try {
    const res = await axios.post('/auth/register', data, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (
      res.data.message &&
      res.data.message !== 'Verification code sent to email'
    ) {
      dispatch(getFailed(res.data.message))
      throw new Error(res.data.message)
    }

    dispatch(postDone())
    dispatch(getSuccess(res.data))
    return res.data
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || 'Register failed'
    dispatch(getFailed(errorMsg))
    throw err
  }
}

export const login = (data: any) => async (dispatch: AppDispatch) => {
  dispatch(getRequest())
  try {
    console.log('data', data)
    const res = await axios.post('/auth/login', data, {
      headers: { 'Content-Type': 'application/json' }
    })
    const user = {
      ...res.data,
      isAdmin: res.data.role === 'admin'
    }
    await AsyncStorage.setItem('user', JSON.stringify(user))
    await AsyncStorage.setItem('token', res.data.token)
    dispatch(postDone())
    dispatch(doneSuccess(user))
    return user
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || 'Login failed'
    dispatch(getError(errorMsg))
    throw err
  }
}

export const getUserProfile = () => async (dispatch: AppDispatch) => {
  dispatch(getRequest())

  try {
    const config = await getAuthConfig()
    const res = await axios.get('/users/me', config)
    dispatch(getProfile(res.data))
  } catch (err: any) {
    dispatch(getFailed(err.response?.data?.message || 'Failed to load profile'))
  }
}

export const updateUser =
  (id: string, data: Partial<User>) => async (dispatch: AppDispatch) => {
    dispatch(getRequest())

    try {
      const config = await getAuthConfig()
      const res = await axios.patch(`/users/${id}`, data, config)
      dispatch(updateSuccess(res.data))
    } catch (err: any) {
      dispatch(getError(err.message))
    }
  }

export const getAllUser = () => async (dispatch: AppDispatch) => {
  dispatch(getRequest())

  try {
    const config = await getAuthConfig()
    const res = await axios.get('/users', config)
    dispatch(getSuccess(res.data))
  } catch (err: any) {
    dispatch(getError(err.message))
  }
}

export const deleteUser = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(getRequest())

  try {
    const config = await getAuthConfig()
    await axios.delete(`/users/${id}`, config)
    dispatch(deleteSuccess(id))
  } catch (err: any) {
    dispatch(getError(err.message))
  }
}
