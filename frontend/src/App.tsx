import { Amplify } from 'aws-amplify';
import { BrowserRouter } from 'react-router-dom';
import config from './constants/config';
import RouterElements from './router';

Amplify.configure({
  Auth: {
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET,
      identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
      endpoints: [
      {
          name: "notes",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
      },
      ]
  }
});

function App() {
  return (
    <BrowserRouter>
      <RouterElements />
    </BrowserRouter>
  );
}

export default App;
