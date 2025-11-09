// redux/movieActions.ts
import { getAuthConfig } from '../authConfig'
import axios from '../customAxios'
import { AppDispatch } from '../store'
import {
  getRequest,
  getFailed,
  getMovieSuccess,
  getError,
  doneDtSuccess,
  getSeatSuccess
} from './movieSlice'

export const getAllMovies =
  ({ status = '', page = 1, limit = 10 } = {}) =>
  async (dispatch: AppDispatch) => {
    dispatch(getRequest())
    try {
      const query = `?page=${page}&limit=${limit}${
        status ? `&status=${status}` : ''
      }`
      const res = await axios.get(`/movies${query}`)
      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(
          getMovieSuccess({
            data: res.data,
            total: res.data.total,
            page: res.data.page,
            limit: res.data.limit,
            totalPages: res.data.totalPages
          })
        )
        // data: { data, total, page, ... }
      }
    } catch (error: any) {
      dispatch(getError(error.message || 'Something went wrong'))
    }
  }

export const getMovieById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(getRequest())
  try {
    const res = await axios.get(`/movies/${id}`)

    if (res.data.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(doneDtSuccess(res.data))
    }
  } catch (error: any) {
    dispatch(getError(error.message || 'Something went wrong'))
  }
}

export const getSeatAvailable =
  (query = '') =>
  async (dispatch: AppDispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const response = await axios.get(
        `/seats/available${query ? `?${query}` : ''}`,
        config
      )

      if (response.data.message) {
        dispatch(getFailed(response.data.message))
      } else {
        dispatch(getSeatSuccess(response.data))
      }
    } catch (error: any) {
      dispatch(getError(error.message))
    }
  }
