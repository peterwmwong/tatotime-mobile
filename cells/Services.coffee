define [
  'Bus'
  'data/UserService'
  'data/ShowService'
], (Bus,UserService,ShowService)->

  isIOS: isIOS = (ua = navigator.userAgent).match(/iPhone/i) or ua.match(/iPod/i) or ua.match(/iPad/i)
  isIOSFullScreen: isIOS and window.navigator.standalone
  user: UserService
  show: ShowService