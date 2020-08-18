import { pageElements } from './base';

export const toggleFavouritesIcon = () => {

  pageElements.favourites.classList.toggle('favourites--off');

};

export const toggleIsFavouriteIcon = () => {

  const isFavouriteIcon = document.querySelector('.basic-info__is-favourite');
  isFavouriteIcon.classList.toggle('basic-info__is-favourite--true');

};

export const toggleFavouritesList = () => {
  pageElements.favouritesList.classList.toggle('favourites__list--off');
  pageElements.favouritesIcon.classList.toggle('favourites__icon--list-on');

}

export const hasClass = (element, className) => {
  return element.classList.contains(className);
}

export const renderNewFavourite = (companyTicker, profile) => {

  const newFavouriteHtml = `
    <li class="favourites__item-info" data-company-ticker="${companyTicker}">
        <a class="favourites__item-activation" href="#${companyTicker}" role="button">
            <figure class="favourites__item-figure">
                <img src="${profile.image}" class="favourites__item-logo"
                    alt="Company logo">
            </figure>
            <div class="favourites__item-data">
                <p class="favourites__item-name">${companyTicker} | ${profile.companyName}</p>
            </div>
        </a>
        <a class="favourites__item-delete" role="button"> <img src="img/delete-icon.svg" class="favourites__item-delete-icon"
            alt="Delete icon">
        </a>
    </li>`;

  pageElements.favouritesList.insertAdjacentHTML('beforeend', newFavouriteHtml);

};

export const deleteFavourite = (companyTicker) => {

  const favouritesItem = document.querySelector(`.favourites__item-info[data-company-ticker="${companyTicker}"]`);

  favouritesItem.parentNode.removeChild(favouritesItem);
}


