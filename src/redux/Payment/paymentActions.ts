import { AppDispatch } from '../store'
import {
  createPaySuccess,
  getError,
  getFailed,
  getRequest
} from './paymentSlice'
import axios from '../customAxios'
import { getAuthConfig } from '../authConfig'

interface PaymentPayload {
  ticketId: string
}

export const createPayMomo = (data: PaymentPayload) => {
  return async (dispatch: AppDispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.post('/payments/create-momo-mobile', data, config)

      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(createPaySuccess(res.data))
        return res.data
      }

      return res
    } catch (error: any) {
      dispatch(getError(error.message || 'Payment error'))
      throw error
    }
  }
}

export const createPayZaloPay = (data: PaymentPayload) => {
  return async (dispatch: AppDispatch) => {
    dispatch(getRequest())
    try {
      const config = await getAuthConfig()
      const res = await axios.post(
        '/payments/create-zalopay-mobile',
        data,
        config
      )
      console.log('res', res.data)
      if (res.data.message) {
        dispatch(getFailed(res.data.message))
      } else {
        dispatch(createPaySuccess(res.data))
        return res.data
      }

      return res
    } catch (error: any) {
      dispatch(getError(error.message || 'Payment error'))
      throw error
    }
  }
}
