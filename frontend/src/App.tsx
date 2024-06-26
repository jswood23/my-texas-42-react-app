import { Amplify } from 'aws-amplify'
import { apiContext } from './constants'
import { BrowserRouter } from 'react-router-dom'
import { StyleSheetManager } from 'styled-components'
import config from './constants/config'
import RouterElements from './router'

Amplify.configure({
  Auth: {
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: apiContext,
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
})

function App () {
  return (
    <BrowserRouter>
      <StyleSheetManager shouldForwardProp={() => true}>
        <RouterElements />
      </StyleSheetManager>
    </BrowserRouter>
  )
}

export default App
