import { pageElements } from './base';

export const getSearchInput = () => pageElements.searchInput.value;

export const renderCompaniesSelection = (companiesSelection) => {

  let input = '';

  companiesSelection.forEach(company => {

    let companyTicker = company.slice(0, company.indexOf('|'));

    input += `
        <li class="companies-selection__item">
            <a class = "companies-selection__item-activation" href="#${companyTicker}" role = "button">
                <p class="companies-selection__item-data">${company}</p>
            </a>
        </li>`
  });

  const companiesSelectionHtml = `
    <ul class="companies-selection">
       ${input}
    </ul>
    `;

  //Change search input field/button border-radius
  pageElements.searchInput.classList.add('search__input--companies-selection-on');
  pageElements.searchButton.classList.add('search__button--companies-selection-on');

  pageElements.header.insertAdjacentHTML('beforeEnd', companiesSelectionHtml);

};


export const removeCompaniesSelection = () => {

  const companiesSelection = document.querySelector('.companies-selection');

  //Change search input field/button border-radius
  pageElements.searchInput.classList.remove('search__input--companies-selection-on');
  pageElements.searchButton.classList.remove('search__button--companies-selection-on');

  companiesSelection.parentNode.removeChild(companiesSelection);
};