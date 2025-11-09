import { AppDispatch } from '../store'
import axios from '../customAxios'
import {
  getRequest,
  getItemSuccess,
  getFailed,
  getError
} from './concessionItemsSlice'

export const getAllItems = () => async (dispatch: AppDispatch) => {
  dispatch(getRequest())
  try {
    const res = await axios.get('/concession-items')

    if (res.data?.message) {
      dispatch(getFailed(res.data.message))
    } else {
      dispatch(getItemSuccess(res.data))
    }
  } catch (error: any) {
    dispatch(getError(error.message))
  }
}
