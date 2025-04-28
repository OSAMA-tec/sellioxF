import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {QueryClientProvider , QueryClient } from "react-query";
import {ReactQueryDevtools} from "react-query/devtools"
import { store } from './redux/store.jsx';
import { Provider } from "react-redux";
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>

      
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
