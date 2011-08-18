define(['Bus', 'data/UserService', 'data/ShowService'], function(Bus, UserService, ShowService) {
  var ua;
  return {
    isIOS: (ua = navigator.userAgent).match(/iPhone/i) || ua.match(/iPod/i) || ua.match(/iPad/i),
    user: UserService,
    show: ShowService
  };
});