import axios from 'axios';
import API_KEY from '../apis';

export default class Search {

  constructor() {
    this.companiesList = [];
  };

  async getCompaniesList() {
    try {
      let result = await axios(`https://financialmodelingprep.com/api/v3/search?query=&limit=&exchange=NASDAQ&apikey=${API_KEY}`);
      this.companiesList = this.companiesList.concat(result.data.map(item => {
        if (item.name) { return `${item.symbol} | ${item.name}` }
      }));
    } catch (error) {
      alert("Error while trying to get list of companies listed on NASDAQ");
    }
  };

  getCompaniesSelection(input = null) {
    if (input) {
      this.companiesSelection = this.companiesList.filter((item) => {
        if (item) {
          if (item.toUpperCase().includes(input.toUpperCase())) { return item };
        };
      }).slice(0, 15).sort();

    } else {
      this.companiesSelection = this.companiesList.sort().slice(0, 15);
    }
  };

  companiesSelectionLength() {
    return this.companiesSelection.length;
  };
};