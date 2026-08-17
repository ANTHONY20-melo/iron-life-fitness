import { Platform } from 'react-native'

const DEV_URL = Platform.select({
  android: 'http://10.0.2.2:3340/api',
  ios: 'http://localhost:3340/api',
  default: 'http://localhost:3340/api',
})

const PROD_URL = 'https://api.ironlifefitness.com.br/api'

export const API_URL = __DEV__ ? DEV_URL : PROD_URL
