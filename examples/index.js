// *** Setup routing ***
import { register } from '/examples/vendor/my-wc/components/routing/routing.js';

// Import "view" components.
import HomeView from './views/HomeView.js';
import AboutView from './views/AboutView.js';

// Define routes
register({ default: true, url: '/home', component: HomeView });
register({ url: '/about', component: AboutView });


// *** MAIN APP ***
import MainApp from './components/MainApp/MainApp.js';

let mainApp = document.createElement(MainApp.tag);
document.body.appendChild(mainApp);
