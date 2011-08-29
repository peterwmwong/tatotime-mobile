define(['data/UserService', 'data/ActorService', 'data/ShowService'], function(UserService, ActorService, ShowService) {
  var isIOS, ua;
  return {
    isIOS: isIOS = (ua = navigator.userAgent).match(/iPhone/i) || ua.match(/iPod/i) || ua.match(/iPad/i),
    isIOSFullScreen: isIOS && window.navigator.standalone,
    user: UserService,
    show: ShowService,
    actor: ActorService
  };
});