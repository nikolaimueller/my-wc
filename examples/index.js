// *** Setup routing ***
import {
    register,
    switchRoute,
    registerBeforeGlobalRoute,
    registerAfterGlobalRoute
} from '/examples/vendor/my-wc/components/routing/routing.js'

// Import "view" components.
import HomeView from './views/HomeView.js'
import AboutView from './views/AboutView.js'
import LoginView, { EVENT_USER_LOGGED_IN } from './views/LoginView.js'

// Current User: demo for routing interception:
let currentUser = {
    account: '',
    displayName: '',
    accessToken: null
}

// Define routes
register({ default: true, url: '/home', component: HomeView })
register({ url: '/about', component: AboutView })
register({ url: '/login', component: LoginView })

registerBeforeGlobalRoute((oldUrl, oldView, newUrl) => {
    // console.log(`custom "beforeGlobalRoute" interceptor:   oldUrl: '${oldUrl}' -- newUlr: '${newUrl}' -- oldView.tag: <${oldView?.tag}>`)
    // Return routing-url {string} to redirect to url.
    // Return null or undefined to proceed normal routing.
    if (currentUser.accessToken === null) {
        // User not logged in -- redirect him to the login page
        return '/login'
    }
    return null
})
registerAfterGlobalRoute((oldUrl, newUrl, newView)  => {
    // console.log(`custom "afterGlobalRoute" interceptor: oldUrl: ${oldUrl} -- toUrl:${newUrl} -- newView: `)
    // Return routing-url {string} to redirect to url.
    // Return null or undefined to proceed normal routing.
    return null
})

// *** MAIN APP ***
import MainApp from './components/MainApp/MainApp.js'

function onUserLoggedIn(event) {
    currentUser.account = event.detail.account
    currentUser.accessToken = event.detail.accessToken
    currentUser.displayName = event.detail.displayName

    switchRoute('/home')
}

let mainApp = document.createElement(MainApp.tag)

document.body.appendChild(mainApp)
document.body.addEventListener(EVENT_USER_LOGGED_IN, onUserLoggedIn.bind(mainApp))