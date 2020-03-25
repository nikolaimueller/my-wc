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

// Add a intercept-routing callback - before switching route.
// Switching can be redirected by returning a registered routing url.
registerBeforeGlobalRoute((oldUrl, oldView, newUrl) => {
    // Return routing-url {string} to redirect to url.
    // Return null or undefined to proceed normal routing.
    if (currentUser.accessToken === null) {
        // User not logged in -- redirect him to the login page
        console.log(`Custom "beforeGlobalRoute" interceptor: -- oldUrl: '${oldUrl}' -- newUlr: '${newUrl}' -- oldView:`, oldView)
        return '/login'
    }
    return null
})

// Add a intercept-routing callback - after route has been switched.
// Switching cannot be "undone" i.e redirected to another route
registerAfterGlobalRoute((oldUrl, newUrl, newView)  => {
    if (true === true) { // dummy condition
        console.log(`Custom "afterGlobalRoute" interceptor: -- oldUrl: '${oldUrl}' -- newUrl: '${newUrl}' -- newView:`, newView)
    }
})

// *** MAIN APP ***
import MainApp from './components/MainApp/MainApp.js'

function onUserLoggedIn(event) {
    currentUser.account = event.detail.account
    currentUser.accessToken = event.detail.accessToken
    currentUser.displayName = event.detail.displayName
    // Programmatically switch route
    switchRoute('/home')
}

let mainApp = document.createElement(MainApp.tag)

document.body.appendChild(mainApp)
document.body.addEventListener(EVENT_USER_LOGGED_IN, onUserLoggedIn.bind(mainApp))