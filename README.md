# StockDashboard

link: https://stock-dashboard-4559d.web.app/

StockDashboard app is powered by data from https://financialmodelingprep.com/ API

----------------------------------------------------------------------------------------------------------------------------

# Application Overview

StockDashboard provides information about companies listed on NASDAQ. User needs to provide company ticker symbol as an input or choose from list which is triggered after focus event on input field. List is filtered based on user input. 

The main features are:

 - Interactive plot of historical stock price. It enables user to analyze the last 5 years of stock price data with line and candlestick plots. It is also possible to adjust time range and price scales. Plots were created using plotly.js library,
 - overall score and recommendation based on company performance,
 - basic financial metrics, 
 - companies can be saved as favourites. List of favourite companies will be preserved in the local storage and will be retrieved on each app load.
  
Application was developed according to the MVC pattern. BEM naming convention was used for CSS.

# Technologies used

ES6+ JavaScript, AJAX, plotly.js library, Webpack, HTML5, CSS3.
