
let registry = [];
let viewTarget = null;

let currentRoute = null;

export function getCurrentRoute() { return currentRoute; }

export function routes() {
    return JSON.parse(JSON.stringify(registry)); // return cloned registry;
}

export function lookupRouteByUrl(url) {
    if (!url) {
        throw new Error('Routing.lookupRouteByUrl: Param url missing.');
    }
    let matchRoute = registry.find(route => route.url === url.toLowerCase());
    return matchRoute;
}

export function register(route) {
    // validate route
    if (!route) {
        throw new Error('Routing: Param route missing');
    }
    if (!route.url) {
        throw new Error('Routing: Invalid route, url missing.');
    }
    if (registry.find((r) => r.url == route.url.toLowerCase())) {
        throw new Error(`Routing: route '${r.url}' already registered.`);
    }

    // insert route
    registry.push(route);

    // default route
    if (route.default && route.default === true) {
        if (currentRoute === null) {
            currentRoute = route;
        }
    }
}

export function switchRoute(newUrl) {
    if (!newUrl) {
        throw new Error('Routing.switchView: Param newUrl missing.');
    }
    if (viewTarget === null) {
        throw new Error('Routing.switchView: viewTarget is null.');
    }
    currentRoute = viewTarget.handleSwitchRoute(currentRoute, newUrl);
}

export function registerTarget(target) {
    if (!target) {
        throw new Error('Routing.registerTarget: Missing param target.');
    }
    if (viewTarget !== null) {
        throw new Error('Routing.registerTarget: viewTarget already set.');
    }
    viewTarget = target;
}