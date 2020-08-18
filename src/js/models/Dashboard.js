import axios from 'axios';
import API_KEY from '../apis';

export default class Dashboard {

  constructor(companyTicker) {
    this.companyTicker = companyTicker;
  }

  async getData() {

    let errorLog = [];

    // Declare date interval for historical data
    const today = new Date();
    const dateTo = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const dateFrom = `${today.getFullYear() - 5}-${today.getMonth()}-${today.getDate()}`;
    let result;

    // Get data from API
    // Company's historical price data
    try {
      result = await axios(`https://financialmodelingprep.com/api/v3/historical-price-full/${this.companyTicker}?from=${dateFrom}&to=${dateTo}&apikey=${API_KEY}`);

      //Data preparation
      this.dates = result.data.historical.map(value => { return value.date });
      this.values = {};

      ['open', 'close', 'high', 'low'].forEach((price) => {
        this.values[price] = result.data.historical.map(value => { return value[price] });
      });

    } catch (error) {
      if (error.request || error.response) {
        errorLog.push("\n - Company's historical data");
      };

    }

    // Company's profile data
    try {
      result = await axios(`https://financialmodelingprep.com/api/v3/company/profile/${this.companyTicker}?apikey=${API_KEY}`);
      this.profile = result.data.profile;

      ['price', 'beta', 'lastDiv'].forEach((profileData) => {

        // Convert profile data to float type
        this.profile[profileData] = parseFloat(this.profile[profileData]).toFixed(2);

        // If profileData value is set to NaN then change it to "-"
        if (this.profile[profileData] === 'NaN') {
          this.profile[profileData] = '-';
        };
      });

    } catch (error) {
      if (error.request || error.response) {
        errorLog.push("\n - Company's profile data");
      };
    }

    // Company's rating data
    try {
      result = await axios(`https://financialmodelingprep.com/api/v3/company/rating/${this.companyTicker}?apikey=${API_KEY}`);

      // If there's no rating data, then assign "-" to the object's rating properties
      if (!result.data.rating) {
        this.rating = {};
        this.rating.rating = '-';
        this.rating.recommendation = '-';
      }
      else {
        this.rating = result.data.rating;
      };

    } catch (error) {
      if (error.request || error.response) {
        errorLog.push("\n - Company's rating");
      };
    }

    // Company's metrics data
    try {
      result = await axios(`https://financialmodelingprep.com/api/v3/company-key-metrics/${this.companyTicker}?apikey=${API_KEY}`);

      // If there is no metrics data then assign "-" to the object's metric properties
      if (!result.data.metrics) {
        this.metrics = {};
        ['PE ratio', 'PB ratio', 'ROE'].forEach((metric) => {
          this.metrics[metric] = "-";
        });
      } else {
        this.metrics = result.data.metrics[0];

        // Metrics value manipulation
        ['PE ratio', 'PB ratio', 'ROE'].forEach((metric) => {

          // Convert metrics to float type
          this.metrics[metric] = parseFloat(this.metrics[metric]).toFixed(2);

          // Add % sign to the ROE metric
          if (metric === 'ROE') {
            this.metrics[metric] += '%';
          };

          // If metric value is set to NaN then change it to "-"
          if (this.metrics[metric] === 'NaN') {
            this.metrics[metric] = '-';
          };
        });
      }
    }
    catch (error) {
      if (error.request || error.response) {
        errorLog.push("\n - Company's key metrics");
      };
    }
    if (errorLog.length > 0) {
      this.errorLog = errorLog;
    }
  }
}