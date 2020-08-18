import Dashboard from './models/Dashboard';
import Search from './models/Search';
import Favourites from './models/Favourites';
import * as dashboardView from './views/dashboardView';
import * as searchView from './views/searchView'
import * as favouritesView from './views/favouritesView';
import { pageElements } from './views/base';
import '../css/style.css';

// GLOBAL APP STATE

const appState = {};

// DASHBOARD CONTROLLER

const controlDashboard = async () => {

  const companyTicker = window.location.hash.replace('#', '').toUpperCase();

  if (companyTicker) {

    // Render loading icon
    dashboardView.renderLoadingIcon();

    // Create new Dashboard object
    appState.dashboard = new Dashboard(companyTicker);

    // Prepare UI   
    dashboardView.clearUI();

    // Get data from API
    try {

      await appState.dashboard.getData();

      // Plot data
      dashboardView.renderPlot(appState.dashboard.dates, appState.dashboard.values);

      // Render table 
      dashboardView.renderCompanyOverview(appState.dashboard.profile, appState.dashboard.rating, appState.dashboard.companyTicker, appState.dashboard.metrics);

    } catch (error) {
      if (appState.dashboard.errorLog) {
        let message = '';
        appState.dashboard.errorLog.forEach(item => {
          message += item;
        });
        alert(`Error while trying to get below information from API: ${message}`);
      } else {
        alert('Invalid company ticker. Try again.');
      };

    };

    // Check if company is on the favourites list
    if (appState.favourites) {

      if (appState.favourites.isFavourite(companyTicker)) {
        favouritesView.toggleIsFavouriteIcon();
      };
    };

    // Remove loading icon
    dashboardView.removeLoadingIcon();

  };

};

// Prepare dashboard on hashchange and load events
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlDashboard));

// SEARCH CONTROLLER

const controlSearch = async (input = null) => {

  // Create search object if it's not yet created and then get companies list
  if (!appState.search) {
    appState.search = new Search();
    await appState.search.getCompaniesList();
  } else {

    if (input) {

      // Prepare companies selection based on user input
      appState.search.getCompaniesSelection(input);
    } else {

      // Prepare companies selection for no input case
      appState.search.getCompaniesSelection()
    }

    // Remove current companies selection from UI
    if (document.querySelector('.companies-selection')) {
      searchView.removeCompaniesSelection();
    };

    // Render new companies selection
    if (appState.search.companiesSelectionLength() > 0) {
      searchView.renderCompaniesSelection(appState.search.companiesSelection);
    };
  };
};

// Get companies list from API on page load
window.addEventListener('load', controlSearch);

// Prepare companies selection on focus event
pageElements.searchInput.addEventListener('focus', () => {
  controlSearch();
});

// Prepare companies selection based on user input
pageElements.searchInput.addEventListener('keyup', (ev) => {
  controlSearch(searchView.getSearchInput())

  // If ev.key is backspace and search input field is empty then prepare companies selection
  // for no input case 
  if (ev.key === "Backspace" && searchView.getSearchInput() === '') {
    controlSearch();
  };
});

// Change URL after submit event
pageElements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  window.location.hash = (searchView.getSearchInput());
  document.activeElement.blur();
});

// Remove companies selection from UI if event target was outside of both companies selection list and input field
window.addEventListener('click', (ev) => {
  if (!ev.target.matches('.companies-selection__item') && !ev.target.matches('.search__input') && document.querySelector('.companies-selection')) {
    searchView.removeCompaniesSelection();
  };
});

// FAVOURITES CONTROLLER

// controlDeleteFavourite function is going to be used for
// both removing favourite item using isFavourite icon and delete icon
const controlDeleteFavourite = (companyTicker) => {

  // Remove company from favourites
  appState.favourites.deleteFavourite(companyTicker);

  // Update UI
  favouritesView.deleteFavourite(companyTicker);

  // Remove favourites object if number of favourite companies equals zero
  if (appState.favourites.countFavourites() === 0) {

    // Remove Object
    delete appState.favourites;

    // Update UI
    favouritesView.toggleFavouritesIcon();

    // Hide favourites list
    if (!favouritesView.hasClass(pageElements.favouritesList, 'favourites__list--off')) {
      favouritesView.toggleFavouritesList();
    };

  };
};

const controlFavourites = () => {

  // Change favourite icon for company
  favouritesView.toggleIsFavouriteIcon();

  // Create new favourites object if it's not yet created
  if (!appState.favourites) {

    appState.favourites = new Favourites();

    // Render favourites icon on UI
    favouritesView.toggleFavouritesIcon();

  };

  if (!appState.favourites.isFavourite(appState.dashboard.companyTicker)) {

    // Add company to favourites
    appState.favourites.addFavourite(appState.dashboard.companyTicker, appState.dashboard.profile);

    // Update UI
    favouritesView.renderNewFavourite(appState.dashboard.companyTicker, appState.dashboard.profile);

  }
  else {
    controlDeleteFavourite(appState.dashboard.companyTicker);
  };
};

// Favourites event handler

window.addEventListener('click', ev => {

  console.log(ev);
  window.a = ev;

  if (ev.target.matches('.basic-info__is-favourite')) {

    controlFavourites();

  }

  // Show or hide favourites list 
  else if (ev.target.matches('.favourites__icon')) {

    favouritesView.toggleFavouritesList();

  }

  // Delete favourite using remove button
  else if (ev.target.matches('.favourites__item-delete-icon')) {

    controlDeleteFavourite(ev.target.parentNode.parentNode.dataset.companyTicker);

    // If deleted company is one which is currently viewed then change the favourite icon
    if (appState.dashboard) {

      if (ev.target.parentNode.parentNode.dataset.companyTicker === appState.dashboard.companyTicker) {

        favouritesView.toggleIsFavouriteIcon();

      };
    };
  }

  // Hide favourites list if it is shown and there is a click event
  else if (!favouritesView.hasClass(pageElements.favouritesList, 'favourites__list--off')
    && !ev.target.matches('.favourites__item-delete-icon')) {

    favouritesView.toggleFavouritesList();
  }
});

// Retrieve favourites on page load
window.addEventListener('load', () => {

  if (JSON.parse(localStorage.favourites).length > 0) {

    appState.favourites = new Favourites();

    // Retrieve favourites
    appState.favourites.readStorage();

    // Toggle favourites icon
    favouritesView.toggleFavouritesIcon();

    // Prepare data and then render favourites
    let favouritesItem = {};

    appState.favourites.favourites.forEach((value, key) => {

      // Assign correct data structure to the favouriteItem
      favouritesItem = appState.favourites.formatFavouritesItem(value, key);

      // Render favourites
      favouritesView.renderNewFavourite(favouritesItem.companyTicker, favouritesItem.profile);
    });
  };
});