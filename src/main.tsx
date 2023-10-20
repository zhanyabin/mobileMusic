import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import store, { useAppDispatch } from 'modules/store'
// import App from './App'
import App from 'layouts/index'
import 'tdesign-react/es/style/index.css'
import './styles/index.less'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <HashRouter>
            {/*<React.StrictMode>*/}
                <App />
            {/*</React.StrictMode>*/}
        </HashRouter>
    </Provider>,
)
