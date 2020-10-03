// Routing core module.

let registry = []
let viewTarget = null

let currentRoute = null
let defaultRoute = null

let lastRouteLink = null

export function getCurrentRoute() { return currentRoute }
export function setCurrentRoute(route) { currentRoute = route }
export function getDefaultRoute() { return defaultRoute }

export function routes() {
    return JSON.parse(JSON.stringify(registry)); // return cloned registry;
}

export function lookupRouteByUrl(url) {
    if (!url) {
        if (defaultRoute !== null) {
            return defaultRoute
        } else {
            throw new Error('Routing.lookupRouteByUrl: both url and defaultRoute musst not be null!')
        }
    }
    let matchRoute = registry.find(route => route.url === url.toLowerCase())
    return matchRoute
}

export function register(route) {
    // Validate route.
    if (!route) {
        throw new Error('Routing: Param route missing');
    }
    if (!route.url) {
        throw new Error('Routing: Invalid route, url missing.')
    }
    if (registry.find((r) => r.url == route.url.toLowerCase())) {
        throw new Error(`Routing: route '${r.url}' already registered.`)
    }

    // Insert route registry.
    registry.push(route)

    // Store default route if given.
    if (route.default && route.default === true) {
        if (defaultRoute === null) {
            defaultRoute = route
        }
    }
}

export function switchRoute(newUrl, routeLink) {
    if (!newUrl) {
        throw new Error('Routing.switchRoute: Param newUrl missing.')
    }
    if (viewTarget === null) {
        throw new Error('Routing.switchRoute: viewTarget is null.')
    }
    
    let oldUrl = currentRoute?.url
    let isHighlightingActivated = true // default is highlighting route-link on activation.

    // Handle interception before routing
    let interceptUrl = interceptBefore(currentRoute?.url, currentRoute?.component, newUrl)
    if (typeof interceptUrl === 'string' && interceptUrl.length > 0) {
        newUrl = interceptUrl
        isHighlightingActivated = false
    }

    // Switch displayed content 
    currentRoute = viewTarget.switchContent(currentRoute, newUrl)

    // Handle interception after routing
    interceptAfter(oldUrl, newUrl, currentRoute?.component /* oldUrl, newUrl, newView */)

    // Handle highlighting on activation
    if (isHighlightingActivated === true && lastRouteLink !== null) {
        lastRouteLink.setAttribute('activated', 'false')
        if (routeLink) {
            routeLink.setAttribute('activated', 'true')
        }
    }
    if (routeLink) { // Set last-route-link any way.
        lastRouteLink = routeLink
    }
}

export function registerTarget(target) {
    if (!target) {
        throw new Error('Routing.registerTarget: Missing param target.')
    }
    if (viewTarget !== null) {
        throw new Error('Routing.registerTarget: viewTarget already set.')
    }
    viewTarget = target
}


// *** Handle interception callbacks
let beforeRouteCBs = []
let afterRouteCBs = []

export function registerBeforeGlobalRoute(callback) {
    // console.log(`Routing.registerBeforeGlobalRoutes`)
    beforeRouteCBs.push(callback)
}

export function registerAfterGlobalRoute(callback) {
    // console.log(`Routing.registerAfterGlobalRoutes`)
    afterRouteCBs.push(callback)
}

export function interceptBefore(oldUrl, oldView, newUrl) {
    let result = null
    beforeRouteCBs.forEach((cb) => {
        result = cb(oldUrl, oldView, newUrl)
    })
    return result
}

export function interceptAfter(oldUrl, newUrl, newView) {
    afterRouteCBs.forEach((cb) => {
        cb(oldUrl, newUrl, newView)
    })
}
