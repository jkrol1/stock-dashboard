export default class Favourites {

  constructor() {
    this.favourites = new Map();
  };

  isFavourite(companyTicker) {

    return this.favourites.get(companyTicker) ? true : false;

  };

  addFavourite(companyTicker, profile) {

    this.favourites.set(companyTicker, [profile.companyName, profile.image]);
    this.saveData();
  };

  deleteFavourite(companyTicker) {

    this.favourites.delete(companyTicker);
    this.saveData();

  };

  countFavourites() {
    return this.favourites.size;
  };


  saveData() {
    localStorage.setItem('favourites', JSON.stringify(Array.from(this.favourites.entries())));
  };

  readStorage() {
    const storage = new Map(JSON.parse(localStorage.getItem('favourites')));

    // Retrieve favourites from the localStorage
    if (storage) this.favourites = storage;
  };

  formatFavouritesItem(value, key) {
    return {
      companyTicker: key,
      profile: {
        companyName: value[0],
        image: value[1]
      }
    };
  };

};
