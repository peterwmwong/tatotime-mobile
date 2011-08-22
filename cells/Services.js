define(['Bus', 'data/UserService', 'data/ShowService'], function(Bus, UserService, ShowService) {
  var isIOS, ua;
  return {
    isIOS: isIOS = (ua = navigator.userAgent).match(/iPhone/i) || ua.match(/iPod/i) || ua.match(/iPad/i),
    isIOSFullScreen: isIOS && window.navigator.standalone,
    user: UserService,
    show: ShowService
  };
});