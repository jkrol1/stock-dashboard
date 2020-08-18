import Plotly from 'plotly.js-finance-dist-min';
import { pageElements } from './base';

export const clearUI = () => {
  pageElements.plot.innerHTML = '';
  pageElements.companyOverview.innerHTML = '';
  pageElements.searchInput.value = '';
}

export const renderLoadingIcon = () => {

  const loadingIconHtml = `
    <img src="img/three-dots.svg" alt="Loader icon" class="loading-icon">
    `;
  pageElements.wrapper.insertAdjacentHTML('afterbegin', loadingIconHtml);

}

export const removeLoadingIcon = () => {
  const loadingIcon = document.querySelector('.loading-icon');
  loadingIcon.parentElement.removeChild(loadingIcon);
}

export const renderPlot = (dates, values) => {

  //Configure plotly.js plot
  const data = [
    {
      x: dates,
      close: values.close,
      high: values.high,
      low: values.low,
      open: values.open,
      increasing: { line: { color: 'black' } },
      decreasing: { line: { color: 'red' } },
      type: 'candlestick',
      name: 'Candlestick',
      xaxis: 'x',
      yaxis: 'y',
      visible: false
    }, {
      x: dates,
      y: values.close,
      line: { color: '#14213D' },
      name: 'Line',
      type: 'scatter',
      fill: 'tozeroy',
      visible: true
    }];
  const selectorOptions = {
    buttons: [{
      step: 'day',
      stepmode: 'backward',
      count: 5,
      label: '5D'
    },
    {
      step: 'month',
      stepmode: 'backward',
      count: 1,
      label: '1M'
    }, {
      step: 'month',
      stepmode: 'backward',
      count: 6,
      label: '6M'
    }, {
      step: 'year',
      stepmode: 'backward',
      count: 1,
      label: '1Y'
    }, {
      step: 'year',
      stepmode: 'todate',
      count: 1,
      label: 'YTD'
    }, {
      step: 'all',
      label: 'All'
    }],
    bgcolor: '#e4f3f5',
    showactive: true,
    font: { size: 14 },
    x: 0,
    xanchor: 'left',
    y: 1.2,
    yanchor: 'top'
  };
  const updatemenus = [
    {
      buttons: [
        {
          args: [{ 'visible': [false, true] }],
          label: 'Line',
          method: 'update'
        },
        {
          args: [{ 'visible': [true, false] }],
          label: 'Candlestick',
          method: 'update'
        }
      ],
      font: { size: 14 },
      bgcolor: '#e4f3f5',
      borderwidth: 1,
      x: 0,
      xanchor: 'left',
      y: 1.35,
      yanchor: 'top',
    },
  ];
  const layout = {
    dragmode: 'zoom',
    showlegend: false,
    updatemenus: updatemenus,
    xaxis: {
      rangeslider: {
        visible: true
      },
      rangeselector: selectorOptions,
      ticks: 'outside',
      showline: true,
    },
    yaxis: {
      autoscale: true,
      fixedrange: false,
      tickprefix: '$ ',
      ticks: 'outside',
      showline: true
    },
    margin: { 't': 0, 'b': 0, 'l': 60, 'r': 30 },
    plot_bgcolor: '#E4F3F5',
    paper_bgcolor: '#E4F3F5'
  };
  const config = { responsive: true, displayModeBar: false };

  Plotly.newPlot(pageElements.plot, data, layout, config);
}

export const renderCompanyOverview = (profile, rating, companyTicker, metrics) => {

  const companyOverviewHtml = `
    <div class="basic-info">
        <img src="${profile.image}" alt="Company logo" class="basic-info__logo">
        <div class = 'basic-info__name-ticker-container'>
            <h2 class="basic-info__name">${profile.companyName}</h2>
            <h3 class="basic-info__ticker">${companyTicker}</h3>
        </div>
        <img src="img/star-not-filled.svg" alt="Favourite icon" class="basic-info__is-favourite">
    </div>
    <div class="score">
        <h4 class="score__text">Score</h4>
        <p class="score__value">${rating.rating}</p>
    </div>
    <div class="recommendation">
        <h4 class="recommendation__text">Recommendation</h4>
        <p class="recommendation__value">${rating.recommendation}</p>
    </div>
    <table class="metrics-table">
        <thead class = "metrics-table__head">
            <tr class = "metrics-table__row">
                <th colspan="2" class = "metrics-table__column">Summary</th>
            </tr>
        </thead>
        <tbody class="metrics-table__body">
            <tr class="metrics-table__row">
                <td class="metrics-table__cell">Price</td>
                <td class="metrics-table__cell">$ ${profile.price}</td>
            </tr>
            <tr class="metrics-table__row">
                <td class="metrics-table__cell">Beta</td>
                <td class="metrics-table__cell">${profile.beta}</td>
            </tr>
            <tr class="metrics-table__row">
                <td class="metrics-table__cell">Last Div</td>
                <td class="metrics-table__cell">${profile.lastDiv}</td>
            </tr>
            <tr class="metrics-table__row">
                <td class="metrics-table__cell">P/E</td>
                <td class="metrics-table__cell">${metrics['PE ratio']}</td>
            </tr>
            <tr class="metrics-table__row">
                <td class="metrics-table__cell">P/B</td>
                <td class="metrics-table__cell">${metrics['PB ratio']}</td>
            </tr>
            <tr class="metrics-table__row">
                <td class="metrics-table__cell">ROE</td>
                <td class="metrics-table__cell">${metrics['ROE']}</td>
            </tr>
        </tbody>
    </table>`;

  pageElements.companyOverview.insertAdjacentHTML('afterbegin', companyOverviewHtml);

  if (profile.companyName.length > 35) {
    document.querySelector('.basic-info__name').style.fontSize = "0.9rem";
  };

}